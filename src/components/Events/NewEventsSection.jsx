import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["events", { max: 3 }],
		queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
		staleTime: 5000,
	});

	const content = useMemo(() => {
		if (isPending) {
			return <LoadingIndicator />;
		}

		if (isError) {
			return (
				<ErrorBlock
					title='An error occurred'
					message={error.info?.message || "Failed to fetch ev"}
				/>
			);
		}

		if (data) {
			return (
				<ul className='events-list'>
					{data.map((event) => (
						<li key={event.id}>
							<EventItem event={event} />
						</li>
					))}
				</ul>
			);
		}
	}, [isPending, isError, data, error]);
	return (
		<section className='content-section' id='new-events-section'>
			<header>
				<h2>Recently added events</h2>
			</header>
			{content}
		</section>
	);
}
