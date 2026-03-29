import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FeedbackButton from './FeedbackButton'

describe('FeedbackButton', () => {
  it('renders the feedback button', () => {
    render(<FeedbackButton />)
    expect(screen.getByRole('button', { name: /give feedback/i })).toBeInTheDocument()
  })

  it('opens the feedback dialog when button is clicked', async () => {
    render(<FeedbackButton />)
    await userEvent.click(screen.getByRole('button', { name: /give feedback/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/your feedback/i)).toBeInTheDocument()
  })

  it('closes the dialog when cancel is clicked', async () => {
    render(<FeedbackButton />)
    await userEvent.click(screen.getByRole('button', { name: /give feedback/i }))
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows confirmation message after submitting feedback', async () => {
    render(<FeedbackButton />)
    await userEvent.click(screen.getByRole('button', { name: /give feedback/i }))
    await userEvent.type(screen.getByLabelText(/your feedback/i), 'Great app!')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/thank you/i)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not submit if feedback is empty', async () => {
    render(<FeedbackButton />)
    await userEvent.click(screen.getByRole('button', { name: /give feedback/i }))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
