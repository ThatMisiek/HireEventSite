import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useMemo } from "react";
import { motion } from "framer-motion";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";
import AuthContext from "../../store/auth-context.jsx";
import { AnimatePresence } from "framer-motion";

export default function EventDetails() {
	const [isDeleting, setIsDeteting] = useState(false);
	const ctx = useContext(AuthContext);

	const params = useParams();
	const navigate = useNavigate();

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["events", params.id],
		queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
	});

	const {
		mutate,
		isPending: isPendingDeletion,
		isError: isErrorDeleting,
		error: deleteError,
	} = useMutation({
		mutationFn: deleteEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["events"],
				refetchType: "none",
			});
			navigate("/events");
		},
	});

	const handleStartDelete = () => {
		setIsDeteting(true);
	};

	const handleStopDelete = () => {
		setIsDeteting(false);
	};

	const handleDelete = () => {
		mutate({ id: params.id });
	};

	const content = useMemo(() => {
		if (isPending) {
			return (
				<div id='event-detail-content' className='center'>
					<p>Fetching event data...</p>
				</div>
			);
		}

		if (isError) {
			return (
				<div id='event-detail-content' className='center'>
					<ErrorBlock
						title='Failed to load event'
						message={error.info?.message || "Failed to fetch data event"}
					/>
				</div>
			);
		}

		if (data) {
			const formatedDate = new Date(data.date).toLocaleDateString("en-US", {
				day: "numeric",
				month: "short",
				year: "numeric",
			});

			return (
				<>
					<header>
						<h1>{data.title}</h1>
						{ctx.isLoggedIn && (
							<nav>
								<button onClick={handleStartDelete}>Delete</button>
								<Link to='edit'>Edit</Link>
							</nav>
						)}
					</header>

					<div id='event-details-content'>
						<motion.img
							whileHover={{ scale: 1.1 }}
							src={`${import.meta.env.VITE_REACT_APP_API_URL}/${data.image}`}
							alt={data.title}
						/>
						<div id='event-details-info'>
							<div>
								<motion.p
									whileHover={{ scale: 1.1 }}
									id='event-details-location'>
									{data.location}
								</motion.p>
								<motion.time
									whileHover={{ color: "#e30d7c" }}
									dateTime={`Todo-DateT$Todo-Time`}>
									{formatedDate} {data.time}
								</motion.time>
							</div>
							<p id='event-details-description'>{data.description}</p>
						</div>
					</div>
				</>
			);
		}
		return null;
	}, [isPending, isError, error, data, ctx.isLoggedIn]);

	return (
		<>
			<AnimatePresence>
				{isDeleting && (
					<Modal onClose={handleStopDelete}>
						<h2>Are you sure?</h2>
						<p>Do you want to delete this event ?</p>
						<div className='form-actions'>
							{isPendingDeletion && <p>Deleting.. please wait</p>}
							{!isPendingDeletion && (
								<>
									<button onClick={handleStopDelete} className='button-text'>
										Cancel
									</button>
									<button onClick={handleDelete} className='button'>
										Delete
									</button>
								</>
							)}
						</div>
						{isErrorDeleting && (
							<ErrorBlock
								title='failed to delete item'
								message={deleteError.info?.message || "failed to delete item"}
							/>
						)}
					</Modal>
				)}
			</AnimatePresence>
			<Outlet />
			<Header>
				<Link to='/events' className='buttone'>
					View all Events
				</Link>
			</Header>
			<article id='event-details'>{content}</article>
		</>
	);
}
