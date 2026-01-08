import { useHumanInTheLoop } from '@copilotkit/react-core'

function CalendarEvent() {
	useHumanInTheLoop({
		name: 'calendar_event',
		description: ` 
        Give the user a choice between two date and time options to add a event today.
            `,
		parameters: [
			{
				name: 'datetime_1',
				type: 'string',
				description:
					'The first date and time option in YYYY-MM-DD HH:MM format',
			},
			{
				name: 'datetime_2',
				type: 'string',
				description:
					'The second date and time option in YYYY-MM-DD HH:MM format',
			},
		],
		render: ({ args, respond, status }) => {
			if (status === 'executing' && respond) {
				return (
					<section className='container'>
						<h3>Choose a date and time for the event:</h3>
						<div className='grid'>
							<button
								onClick={() => respond?.(args.datetime_1)}
								className='outline'>
								{args.datetime_1}
							</button>
							<button
								onClick={() => respond?.(args.datetime_2)}
								className='outline'>
								{args.datetime_2}
							</button>
						</div>
					</section>
				)
			}
			return <></>
		},
	})
	return <></>
}

export { CalendarEvent }
