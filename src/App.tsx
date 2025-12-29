import { MastraReactProvider } from '@mastra/react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Dashboard from './pages/dashboard'
import { MASTRA_BASE_URL } from './meta'

export default function Page() {
	return (
		<MastraReactProvider baseUrl={MASTRA_BASE_URL}>
			<BrowserRouter>
				<Routes>
					<Route path='/'>
						<Route index element={<Dashboard />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</MastraReactProvider>
	)
}
