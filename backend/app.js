import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";

const app = express();
const timeoutDuration = 1000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	next();
});

// Funkcja sprawdzająca, czy wszystkie wymagane pola są uzupełnione
function areAllFieldsFilled(event) {
	return (
		event.title?.trim() ||
		event.description?.trim() ||
		event.date?.trim() ||
		event.time?.trim() ||
		event.image?.trim() ||
		event.location?.trim()
	);
}

app.get("/events", async (req, res) => {
	const { max, search } = req.query;
	const eventsFileContent = await fs.readFile("./data/events.json");
	let events = JSON.parse(eventsFileContent);

	if (search) {
		events = events.filter((event) => {
			const searchableText = `${event.title} ${event.description} ${event.location}`;
			return searchableText.toLowerCase().includes(search.toLowerCase());
		});
	}

	if (max) {
		events = events.slice(events.length - max, events.length);
	}

	res.json({
		events: events.map((event) => ({
			id: event.id,
			title: event.title,
			image: event.image,
			date: event.date,
			location: event.location,
		})),
	});
});

app.get("/events/images", async (req, res) => {
	const imagesFileContent = await fs.readFile("./data/images.json");
	const images = JSON.parse(imagesFileContent);

	res.json({ images });
});

app.get("/events/:id", async (req, res) => {
	const { id } = req.params;

	const eventsFileContent = await fs.readFile("./data/events.json");
	const events = JSON.parse(eventsFileContent);

	const event = events.find((event) => event.id === id);

	if (!event) {
		return res
			.status(404)
			.json({ message: `For the id ${id}, no event could be found.` });
	}

	setTimeout(() => {
		res.json({ event });
	}, timeoutDuration);
});

app.post("/events", async (req, res) => {
	const { event } = req.body;

	if (!event) {
		return res.status(400).json({ message: "Event is required" });
	}

	// Sprawdzenie czy wszystkie wymagane pola są uzupełnione
	if (!areAllFieldsFilled(event)) {
		return res.status(400).json({ message: "Invalid data provided." });
	}

	const eventsFileContent = await fs.readFile("./data/events.json");
	const events = JSON.parse(eventsFileContent);

	const newEvent = {
		id: Math.round(Math.random() * 10000).toString(),
		...event,
	};

	events.push(newEvent);

	await fs.writeFile("./data/events.json", JSON.stringify(events));

	res.json({ event: newEvent });
});

app.put("/events/:id", async (req, res) => {
	const { id } = req.params;
	const { event } = req.body;

	if (!event) {
		return res.status(400).json({ message: "Event is required" });
	}

	// Sprawdzenie czy wszystkie wymagane pola są uzupełnione
	if (!areAllFieldsFilled(event)) {
		return res.status(400).json({ message: "Invalid data provided." });
	}

	const eventsFileContent = await fs.readFile("./data/events.json");
	const events = JSON.parse(eventsFileContent);

	const eventIndex = events.findIndex((event) => event.id === id);

	if (eventIndex === -1) {
		return res.status(404).json({ message: "Event not found" });
	}

	events[eventIndex] = {
		id,
		...event,
	};

	await fs.writeFile("./data/events.json", JSON.stringify(events));

	setTimeout(() => {
		res.json({ event: events[eventIndex] });
	}, timeoutDuration);
});

app.delete("/events/:id", async (req, res) => {
	const { id } = req.params;

	const eventsFileContent = await fs.readFile("./data/events.json");
	const events = JSON.parse(eventsFileContent);

	const eventIndex = events.findIndex((event) => event.id === id);

	if (eventIndex === -1) {
		return res.status(404).json({ message: "Event not found" });
	}

	events.splice(eventIndex, 1);

	await fs.writeFile("./data/events.json", JSON.stringify(events));

	setTimeout(() => {
		res.json({ message: "Event deleted" });
	}, timeoutDuration);
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
