import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faBook, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="nav">
      <ul>
        <CustomLink to = "/chat"><FontAwesomeIcon icon={faPencil}/>
        Chat</CustomLink>
      </ul>
      <ul>
      <CustomLink to="/entries"><FontAwesomeIcon icon={faBook}/>Entries</CustomLink>
      </ul>
      <ul>
      <CustomLink to="/calendar"><FontAwesomeIcon icon={faCalendarDays} size="lg" style={{color: "#B197FC",}} />Calendar</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}