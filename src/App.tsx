import { MastraReactProvider } from '@mastra/react'
import { BrowserRouter, Routes, Route } from 'react-router'
import PersonalAssistant from './pages/personal-assistant'
import { MASTRA_BASE_URL } from './meta'

export default function Page() {
	return (
		<MastraReactProvider baseUrl={MASTRA_BASE_URL}>
			<BrowserRouter>
				<Routes>
					<Route path='/personal-assistant'>
						<Route index element={<PersonalAssistant />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</MastraReactProvider>
	)
}
