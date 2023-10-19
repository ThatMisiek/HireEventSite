import { Link, Outlet } from "react-router-dom";
import React, { useContext } from "react";

import Header from "../Header.jsx";
import EventsIntroSection from "./EventsIntroSection.jsx";
import FindEventSection from "./FindEventSection.jsx";
import NewEventsSection from "./NewEventsSection.jsx";
import AuthContext from "../../store/auth-context";
import Footer from "../UI/Footer.jsx";


export default function Events() {
	const ctx = useContext(AuthContext);

	return (
		<>
			<Outlet />
			<Header>
				{ctx.isLoggedIn && (
					<Link to='/events/new' className='button'>
						New Event
					</Link>
				)}
				{!ctx.isLoggedIn && (
					<Link to='/events/sign-up' className='button'>
						Sigh Up
					</Link>
				)}
				{ctx.isLoggedIn && (
					<Link to='/events' className='button' onClick={ctx.onLogout}>
						Logout
					</Link>
				)}
			</Header>
			<main>
				<EventsIntroSection />
				<NewEventsSection />
				<FindEventSection />
				<Footer />
			</main>
		</>
	);
}
