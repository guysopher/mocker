// Add any global test setup here
import '@testing-library/jest-dom'

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock for react-zoom-pan-pinch
jest.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }) => children({ zoomIn: jest.fn(), zoomOut: jest.fn(), resetTransform: jest.fn() }),
  TransformComponent: ({ children, ...props }) => <div {...props}>{children}</div>,
}))

// Mock for next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))