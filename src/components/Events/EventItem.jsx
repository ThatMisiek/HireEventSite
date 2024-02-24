import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function EventItem({ event }) {
	const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
	return (
		<article className='event-item'>
			<img
				src={`${import.meta.env.VITE_REACT_APP_API_URL}/${event.image}`}
				alt={event.title}
			/>
			<div className='event-item-content'>
				<div>
					<h2>{event.title}</h2>
					<p className='event-item-date'>{formattedDate}</p>
					<p className='event-item-location'>{event.location}</p>
				</div>
				<motion.p whileHover={{ scale: 1.1 }}>
					<Link to={`/events/${event.id}`} className='buttone'>
						View Details
					</Link>
				</motion.p>
			</div>
		</article>
	);
}
