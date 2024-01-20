import { useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import { motion } from "framer-motion";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventSection() {
	const searchElement = useRef();
	const [searchTerm, setSearchTerm] = useState();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["events", { searchTerm: searchTerm }],
		queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
		enabled: searchTerm !== undefined,
	});

	function handleSubmit(event) {
		event.preventDefault();
		setSearchTerm(searchElement.current.value);
	}

	const content = useMemo(() => {
		if (isLoading) {
			return <LoadingIndicator />;
		}

		if (isError) {
			return (
				<ErrorBlock
					title='An error accoured '
					message={error.info?.message || "Failed to fetch events."}
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
		return <p>Please enter a search term to find events.</p>;
	}, [isLoading, isError, data, error]);

	return (
		<section className='content-section' id='all-events-section'>
			<header>
				<h2>Find your event!</h2>
				<form onSubmit={handleSubmit} id='search-form'>
					<input
						type='search'
						placeholder='Click search for all'
						ref={searchElement}
					/>
					<motion.button
						whileHover={{ scale: 1.1, backgroundColor: "#e30d7c" }}
						transition={{ type: "spring", stiffness: 500 }}>
						Search
					</motion.button>
				</form>
			</header>
			{content}
		</section>
	);
}
