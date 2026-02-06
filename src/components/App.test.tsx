import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import { HelmetProvider } from '@dr.pogodin/react-helmet'

describe('App', () => {
    it('renders without crashing', () => {
        // Wrap in HelmetProvider if necessary, though App uses Helmet inside.
        const { container } = render(
            <HelmetProvider>
                <App />
            </HelmetProvider>
        )
        expect(container.getElementsByClassName('app-wrapper').length).toBe(1)
    })
})
