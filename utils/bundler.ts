// File: utils/bundler.ts
import * as esbuild from 'esbuild';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

/**
 * Bundles React code string into browser-executable JavaScript
 * @param {string} codeString - Raw React code including imports, TypeScript, JSX, etc.
 * @param {Object} options - Bundling options
 * @returns {Promise<string>} - Bundled JavaScript code
 */
export async function bundleReactCode(codeString: string, options: any = {}) {
    // Modify the input code to use global React instead of imports
    const modifiedCode = codeString.replace(
        /import\s+React,\s*{\s*([^}]+)\s*}\s*from\s+['"]react['"]/g,
        (_, imports) => {
            // Keep the original import but make it use global React
            return `// Using global React instead of imports
const { ${imports} } = React;`;
        }
    ).replace(
        /import\s+{\s*([^}]+)\s*}\s*from\s+['"]react['"]/g,
        (_, imports) => {
            // Keep the original import but make it use global React
            return `// Using global React instead of imports
const { ${imports} } = React;`;
        }
    ).replace(
        /import\s+React\s+from\s+['"]react['"]/g,
        `// Using global React instead of imports`
    ).replace(
        /import\s+{\s*([^}]+)\s*}\s*from\s+['"]antd['"]/g,
        (_, imports) => {
            // Handle Ant Design imports
            return `// Using global antd instead of imports
const { ${imports} } = window.antd;`;
        }
    ).replace(
        /import\s+antd\s+from\s+['"]antd['"]/g,
        `// Using global antd instead of imports
const antd = window.antd;`
    ).replace(
        /import\s+{\s*([^}]+)\s*}\s*from\s+['"]@ant-design\/icons['"]/g,
        (_, imports) => {
            // Handle Ant Design Icons imports
            return `// Using global icons instead of imports
const { ${imports} } = window.icons;`;
        }
    ).replace(
        /import\s+\*\s+as\s+Icons\s+from\s+['"]@ant-design\/icons['"]/g,
        `// Using global icons instead of imports
const Icons = window.icons;`
    );

    // Create a virtual file system for esbuild
    const virtualFS = {
        'virtual-component.tsx': modifiedCode,
        'process-polyfill.js': `
            const process = { env: { NODE_ENV: "production" } };
            export default process;
            export { process };
        `,
        'react-shim.js': `
            // This is a placeholder for React
            const React = window.React;
            export default React;
        `,
        'react-dom-shim.js': `
            // This is a placeholder for ReactDOM
            const ReactDOM = window.ReactDOM;
            export default ReactDOM;
        `,
        'antd-shim.js': `
            // This is a placeholder for Ant Design
            const antd = window.antd;
            export default antd;
        `,
        'antd-icons-shim.js': `
            // This is a placeholder for Ant Design Icons
            const icons = window.icons;
            export default icons;
            // Export all icons as named exports
            for (const key in icons) {
                if (Object.prototype.hasOwnProperty.call(icons, key)) {
                    exports[key] = icons[key];
                }
            }
        `,
        'tailwind-shim.css': `
            /* Tailwind is loaded globally via CDN */
        `,
    };

    try {
        // Create a bundle configuration
        const bundleResult = await esbuild.build({
            entryPoints: ['virtual-component.tsx'],
            bundle: true,
            minify: false,
            format: 'iife',
            globalName: 'Component',
            target: 'es2015',
            platform: 'browser',
            plugins: [
                // Custom plugin to handle virtual files and node modules
                {
                    name: 'virtual-fs-and-node-polyfills',
                    setup(build) {
                        // Handle process module
                        build.onResolve({ filter: /^process$/ }, () => {
                            return { path: 'process-polyfill.js', namespace: 'virtual-fs' };
                        });

                        // Handle virtual files
                        build.onResolve({ filter: /^virtual-component\.tsx$/ }, args => {
                            return { path: args.path, namespace: 'virtual-fs' };
                        });

                        build.onLoad({ filter: /.*/, namespace: 'virtual-fs' }, args => {
                            if (virtualFS[args.path as keyof typeof virtualFS]) {
                                return {
                                    contents: virtualFS[args.path as keyof typeof virtualFS],
                                    loader: args.path.endsWith('.tsx') ? 'tsx' : 
                                           args.path.endsWith('.css') ? 'css' : 'js',
                                };
                            }
                            return undefined;
                        });

                        // Handle React and ReactDOM imports
                        build.onResolve({ filter: /^react$/ }, () => {
                            return { path: 'react-shim.js', namespace: 'virtual-fs' };
                        });
                        
                        build.onResolve({ filter: /^react-dom$/ }, () => {
                            return { path: 'react-dom-shim.js', namespace: 'virtual-fs' };
                        });
                        
                        build.onResolve({ filter: /^react-dom\/client$/ }, () => {
                            return { path: 'react-dom-shim.js', namespace: 'virtual-fs' };
                        });
                        
                        // Handle Ant Design imports
                        build.onResolve({ filter: /^antd$/ }, () => {
                            return { path: 'antd-shim.js', namespace: 'virtual-fs' };
                        });
                        
                        // Handle Ant Design Icons imports
                        build.onResolve({ filter: /^@ant-design\/icons$/ }, () => {
                            return { path: 'antd-icons-shim.js', namespace: 'virtual-fs' };
                        });
                        
                        // Handle CSS imports including Tailwind
                        build.onResolve({ filter: /\.css$/ }, () => {
                            return { path: 'tailwind-shim.css', namespace: 'virtual-fs' };
                        });
                        
                        // Handle other Node.js built-ins that might be used
                        build.onResolve({ filter: /^(path|fs|crypto|buffer|stream|util|events|os|url|http|https|zlib|querystring|string_decoder|punycode|domain|assert|tty|net|dns|dgram|child_process|cluster|module|vm|readline|repl|tls|https|http2|perf_hooks|async_hooks|timers|console|v8)$/ }, args => {
                            return { path: 'empty-module.js', namespace: 'node-polyfills' };
                        });
                        
                        build.onLoad({ filter: /.*/, namespace: 'node-polyfills' }, () => {
                            return { contents: 'export default {}', loader: 'js' };
                        });
                    },
                },
            ],
            write: false, // Don't write to disk
            outfile: 'virtual-output.js',
            define: {
                'process.env.NODE_ENV': '"production"',
                'global': 'window',
            },
            inject: options.inject || [],
        });

        // Get the output text
        const outputText = new TextDecoder().decode(bundleResult.outputFiles[0].contents);

        // Create a wrapper with proper initialization
        const finalCode = `
// Bundled React Component - Generated by NextJS API

// Ensure React and ReactDOM are available globally with all their exports
if (!window.React || !window.React.useState) {
  console.error('React with hooks is not available in the global scope. Make sure React is loaded before this script.');
}

// Ensure Ant Design is available globally
if (!window.antd) {
  console.error('Ant Design is not available in the global scope. Make sure antd is loaded before this script.');
}

// Ensure Ant Design Icons are available globally
if (!window.icons) {
  console.warn('Ant Design Icons are not available in the global scope. Icons may not display correctly.');
  window.icons = {};
}

// Add Tailwind CSS if not already included
if (!document.getElementById('tailwind-css')) {
  const tailwindLink = document.createElement('link');
  tailwindLink.id = 'tailwind-css';
  tailwindLink.rel = 'stylesheet';
  tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
  document.head.appendChild(tailwindLink);
}

// Add Ant Design CSS if not already included
if (!document.getElementById('antd-css')) {
  const antdLink = document.createElement('link');
  antdLink.id = 'antd-css';
  antdLink.rel = 'stylesheet';
  antdLink.href = 'https://cdn.jsdelivr.net/npm/antd@5.x/dist/reset.css';
  document.head.appendChild(antdLink);
}

// Add Ant Design Icons if not already included
if (!document.getElementById('antd-icons-script')) {
  const iconsScript = document.createElement('script');
  iconsScript.id = 'antd-icons-script';
  iconsScript.src = 'https://cdn.jsdelivr.net/npm/@ant-design/icons@latest/dist/index.umd.min.js';
  iconsScript.onload = function() {
    window.icons = window.icons || window.AntDesignIcons;
    // Re-render the component after icons are loaded
    if (window.Component && window.ReactDOM) {
      const container = document.getElementById('render-page-todo-app');
      if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(Component.default || Component));
      }
    }
  };
  document.head.appendChild(iconsScript);
}

${outputText}

// Make sure the component is properly exported
if (typeof Component === 'object' && Component.default) {
  // If the component was exported as default
  window.Component = Component;
} else if (typeof Component === 'function') {
  // If the component is directly a function
  window.Component = { default: Component };
}

// Component is exported as a global variable and can be used with:
// const root = ReactDOM.createRoot(container);
// root.render(React.createElement(Component.default || Component));
`;

        return finalCode;

    } catch (error) {
        console.error('Bundling error:', error);
        throw error;
    }
}