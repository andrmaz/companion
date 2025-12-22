import { CopilotSidebar } from '@copilotkit/react-ui'
import { CopilotKit } from '@copilotkit/react-core'
import '@copilotkit/react-ui/styles.css'
import { MASTRA_BASE_URL } from '../meta'

const instructions =
	'You are assisting the user as best as you can. Answer in the best way possible given the data you have.'
const labels = {
	title: 'Personal Assistant',
	initial: 'Hi! I am your personal assistant. How can I help you today?',
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
				suggestions='auto'
				className='h-full'
			/>
		</CopilotKit>
	)
}

export default PersonalAssistant
