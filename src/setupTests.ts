/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
class IntersectionObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn()
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// Mock Canvas for Lottie/Three.js
HTMLCanvasElement.prototype.getContext = vi.fn((contextId) => {
    if (contextId === '2d') {
        return {
            fillRect: vi.fn(),
            clearRect: vi.fn(),
            getImageData: vi.fn(() => ({ data: new Array(4).fill(0) })),
            putImageData: vi.fn(),
            createImageData: vi.fn(() => []),
            setTransform: vi.fn(),
            drawImage: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            closePath: vi.fn(),
            stroke: vi.fn(),
            translate: vi.fn(),
            scale: vi.fn(),
            rotate: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            measureText: vi.fn(() => ({ width: 0 })),
            transform: vi.fn(),
            rect: vi.fn(),
            clip: vi.fn(),
        } as any
    }
    return null
}) as any
