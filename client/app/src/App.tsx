import { useState } from "react";
import Index from "./routes/Index.tsx";
import Header from "./components/Header.tsx";
import "./App.css";

function App() {
	return (
		<>
			<Header></Header>
			<div className="flex flex-col">
				<Index></Index>
			</div>
		</>
	);
}

export default App;
