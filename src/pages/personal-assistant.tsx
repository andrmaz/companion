import { CopilotSidebar } from '@copilotkit/react-ui'
import { CopilotKit } from '@copilotkit/react-core'
import '@copilotkit/react-ui/styles.css'
import { MASTRA_BASE_URL } from '../meta'
import EmailCard from '../components/email-card'

const suggestions: { title: string; message: string }[] = [
	{
		title: 'Tell me about unread emails',
		message: 'Do I have any unread emails in my inbox?',
	},
]
const instructions =
	'You are assisting the user as best as you can. Answer in the best way possible given the data you have.'
const labels = {
	title: 'Personal Assistant',
	initial: 'Hi! 👋 Ask me about your emails status.',
}

function PersonalAssistant() {
	return (
		<CopilotKit
			// Defined through registerCopilotKit() in src/mastra/index.ts
			runtimeUrl={`${MASTRA_BASE_URL}/personal-assistant`}
			agent='personal'>
			<CopilotSidebar
				defaultOpen={true}
				instructions={instructions}
				labels={labels}
				suggestions={suggestions}
				className='h-full'
			/>
			<EmailCard />
		</CopilotKit>
	)
}

export default PersonalAssistant
