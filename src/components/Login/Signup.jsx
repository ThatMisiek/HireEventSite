import React, { useContext } from "react";
import Login from "./Login";
import AuthContext from "../../store/auth-context";
import { AnimatePresence } from "framer-motion";

function SignUp() {
	const ctx = useContext(AuthContext);

	return <AnimatePresence>{!ctx.isLoggedIn && <Login />}</AnimatePresence>;
}
export default SignUp;
