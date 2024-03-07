import {
	Link,
	redirect,
	useNavigate,
	useParams,
	useSubmit,
	useNavigation,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { fetchEvent, updateEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
	const navigate = useNavigate();
	const { state } = useNavigation();
	const submit = useSubmit();
	const params = useParams();

	const { data, isError, error } = useQuery({
		queryKey: ["events", params.id],
		queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
		staleTime: 10000,
	});

	function handleSubmit(formData) {
		submit(formData, { method: "PUT" });
	}

	function handleClose() {
		navigate("../");
	}

	const content = useMemo(() => {
		if (isError) {
			return (
				<>
					<ErrorBlock
						title='Failed to laod event'
						message={error.info?.message || "Failed to load events"}
					/>
					<div className='form-actions'>
						<Link to='../' className='button'>
							OK
						</Link>
					</div>
				</>
			);
		}

		if (data) {
			return (
				<EventForm inputData={data} onSubmit={handleSubmit}>
					{state === "submitting" ? (
						<p>Sending data...</p>
					) : (
						<>
							<Link to='../' className='button-text'>
								Cancel
							</Link>
							<button type='submit' className='button'>
								Update
							</button>
						</>
					)}
				</EventForm>
			);
		}
	}, [isError, data, error, state, handleSubmit]);

	return <Modal onClose={handleClose}>{content}</Modal>;
}

export function loader({ params }) {
	return queryClient.fetchQuery({
		queryKey: ["events", params.id],
		queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
	});
}
export async function action({ request, params }) {
	const formData = await request.formData();
	const updatedEventData = Object.fromEntries(formData);
	await updateEvent({ id: params.id, event: updatedEventData });
	await queryClient.invalidateQueries(["events"]);
	return redirect("../");
}
