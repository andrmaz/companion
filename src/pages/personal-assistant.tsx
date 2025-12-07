import { CopilotChat } from '@copilotkit/react-ui'
import { CopilotKit } from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'
import '@copilotkit/react-ui/styles.css'
import { MASTRA_BASE_URL } from '../meta'

const suggestions: { title: string; message: string }[] = [
	{
		title: 'Tell me about unread emails',
		message: 'Do I have any unread emails in my inbox?',
	},
	{
		title: 'Tell me about workspace open issues',
		message: 'What issues do I have open in wallet-8bea383954a2?',
	},
]

function PersonalAssistant() {
	return (
		<CopilotKit
			// Defined through registerCopilotKit() in src/mastra/index.ts
			runtimeUrl={`${MASTRA_BASE_URL}/personal-assistant`}
			agent='personal'>
			<CopilotSidebar />
			<CopilotChat
				labels={{
					title: 'Personal Assistant',
					initial: 'Hi! 👋 Ask me about emails and open source projects.',
				}}
				suggestions={suggestions}
				className='h-full w-full mx-auto'
			/>
		</CopilotKit>
	)
}

export default PersonalAssistant
