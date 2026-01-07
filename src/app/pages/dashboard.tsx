import { CopilotChat } from '@copilotkit/react-ui'
import { CopilotKit } from '@copilotkit/react-core'
import { MASTRA_BASE_URL } from '../meta'
import '@copilotkit/react-ui/styles.css'

const instructions =
	'You are assisting the user as best as you can. Answer in the best way possible given the data you have.'
const labels = {
	title: 'Personal Assistant',
	initial: 'Hi! I am your personal assistant. How can I help you today?',
}

function Dashboard() {
	return (
		<CopilotKit
			// Defined through registerCopilotKit() in src/mastra/index.ts
			runtimeUrl={`${MASTRA_BASE_URL}/chat`}
			agent='personal'>
			<div className='copilot-kit-chat-container'>
				<CopilotChat
					instructions={instructions}
					labels={labels}
					suggestions='auto'
					className='copilot-kit-chat'
				/>
			</div>
		</CopilotKit>
	)
}

export default Dashboard
