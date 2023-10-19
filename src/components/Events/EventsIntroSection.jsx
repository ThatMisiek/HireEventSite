import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useContext } from "react";

import AuthContext from "../../store/auth-context";

export default function EventsIntroSection() {
	const ctx = useContext(AuthContext);

	return (
		<section className='content-section' id='overview-section'>
			<h2>
				Connect with best engineer <br />
				in <strong>this business</strong>
			</h2>
			<p>
				To ask for reservation time on your event
				<strong> log in</strong> and provide details of your event and we will
				call you back asap.
			</p>
			{ctx.isLoggedIn && (
				<motion.p whileHover={{ scale: 1.1 }}>
					<Link to='/events/new' className='button'>
						Create your first event
					</Link>
				</motion.p>
			)}
			{!ctx.isLoggedIn && (
				<p>
					<Link to='/events/sign-up' className='button'>
						Sign Up and fill event form!
					</Link>
				</p>
			)}
		</section>
	);
}
