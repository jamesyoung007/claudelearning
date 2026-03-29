import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!feedback.trim()) return
    setSubmitted(true)
    setOpen(false)
    setFeedback('')
  }

  return (
    <div>
      <button onClick={() => { setOpen(true); setSubmitted(false) }}>
        Give Feedback
      </button>

      {submitted && <p role="status">Thank you for your feedback!</p>}

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Feedback">
          <form onSubmit={handleSubmit}>
            <label htmlFor="feedback-input">Your feedback</label>
            <textarea
              id="feedback-input"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  )
}
