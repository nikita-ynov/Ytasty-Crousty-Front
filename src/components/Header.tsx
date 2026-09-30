import { Link } from "react-router-dom";

export default function Header () {
    return (
        <header>
            <nav>
                <ul>
                    <Link to="/">Home</Link>
                </ul>
            </nav>
        </header>
    )
}