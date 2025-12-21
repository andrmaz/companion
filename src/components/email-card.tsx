import { useRenderToolCall } from '@copilotkit/react-core'

function EmailCard() {
	useRenderToolCall({
		name: 'zapier_gmail_find_email',
		description: 'Displays the last unread emails in the user inbox',
		render: ({ status, result }) => {
			if (status === 'inProgress') {
				return <p>Loading...</p>
			}
			if (status === 'complete' && result) {
				console.log('Tool call result:', result)
				const text = JSON.parse(result.content[0]?.text)
				const emails: { subject: string; sender: string; date: string }[] =
					text.results
				return (
					<article>
						<h2>Last Unread Email</h2>
						{emails.length === 0 && <p>No unread emails found.</p>}
						{emails.map((email, index) => (
							<div
								key={index}
								style={{
									border: '1px solid #ccc',
									padding: '10px',
									marginBottom: '10px',
									borderRadius: '5px',
								}}>
								<h3>
									<strong>Subject:</strong> {email.subject}
								</h3>
								<p>
									<strong>Sender:</strong> {email.sender}
								</p>
								<time>
									<strong>Date:</strong> {email.date}
								</time>
							</div>
						))}
					</article>
				)
			}
			return <></>
		},
	})
	return <></>
}

export default EmailCard
