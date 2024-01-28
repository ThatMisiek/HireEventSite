import React, {
	useState,
	useEffect,
	useReducer,
	useContext,
	useRef,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Input from "./Input";
import Modal from "../UI/Modal";

const formReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		const isEmailValid =
			action.field === "email" ? action.val.includes("@") : state.email.isValid;
		const isPasswordValid =
			action.field === "password"
				? action.val.trim().length > 6
				: state.password.isValid;

		return {
			...state,
			[action.field]: {
				value: action.val,
				isValid: action.field === "email" ? isEmailValid : isPasswordValid,
			},
		};
	}
	if (action.type === "INPUT_BLUR") {
		return {
			...state,
			[action.field]: {
				value: state[action.field].value,
				isValid:
					action.field === "email"
						? state.email.value.includes("@")
						: state.password.value.trim().length > 6,
			},
		};
	}
	return {
		email: { value: "", isValid: false },
		password: { value: "", isValid: false },
	};
};

const Login = (props, event) => {
	const [formState, dispatchForm] = useReducer(formReducer, {
		email: { value: "", isValid: null },
		password: { value: "", isValid: null },
	});
	const [formIsValid, setFormIsValid] = useState(false);
	const navigate = useNavigate();

	const authCtx = useContext(AuthContext);

	const emailInputRef = useRef();
	const passwordInputRef = useRef();

	const { email, password } = formState;

	useEffect(() => {
		const identifier = setTimeout(() => {
			setFormIsValid(email.isValid && password.isValid);
		}, 500);

		return () => {
			clearTimeout(identifier);
		};
	}, [email.isValid, password.isValid]);

	const inputChangeHandler = (field, value) => {
		dispatchForm({ type: "USER_INPUT", field, val: value });
	};

	const inputBlurHandler = (field) => {
		dispatchForm({ type: "INPUT_BLUR", field });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			authCtx.onLogin(email.value, password.value);
		} else if (!email.isValid) {
			emailInputRef.current.focus();
		} else {
			passwordInputRef.current.focus();
		}
	};

	return (
		<>
			<Modal onClose={() => navigate("../")}>
				<form onSubmit={submitHandler}>
					<Input
						ref={emailInputRef}
						id='email'
						label='E-Mail'
						type='email'
						isValid={email.isValid}
						value={email.value}
						onChange={(event) =>
							inputChangeHandler("email", event.target.value)
						}
						onBlur={() => inputBlurHandler("email")}
					/>
					<Input
						ref={passwordInputRef}
						id='password'
						label='Password'
						type='password'
						isValid={password.isValid}
						value={password.value}
						onChange={(event) =>
							inputChangeHandler("password", event.target.value)
						}
						onBlur={() => inputBlurHandler("password")}
					/>
					<div className='form-actions'>
						<Link to='../' className='button-text'>
							Cancel
						</Link>
						<button type='submit' className='button'>
							Login
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default Login;
