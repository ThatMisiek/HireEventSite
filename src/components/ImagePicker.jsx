import { motion } from "framer-motion";

export default function ImagePicker({ images, selectedImage, onSelect }) {
	return (
		<div id='image-picker'>
			<p>Select an image</p>
			<motion.ul
				variants={{
					visible: { transition: { staggerChildren: 0.05 } },
				}}>
				{images.map((image) => (
					<motion.li
						variants={{
							hidden: { opacity: 0, scale: 0.5 },
							visible: { opacity: 1, scale: [0.8, 1.2, 1] },
						}}
						exit={{ opacity: 1, scale: 1 }}
						transition={{ type: "spring" }}
						whileHover={{ scale: [1.08, 1] }}
						key={image.path}
						onClick={() => onSelect(image.path)}
						className={selectedImage === image.path ? "selected" : undefined}>
						<img
							src={`${import.meta.env.VITE_REACT_APP_API_URL}/${image.path}`}
							alt={image.caption}
						/>
					</motion.li>
				))}
			</motion.ul>
		</div>
	);
}
