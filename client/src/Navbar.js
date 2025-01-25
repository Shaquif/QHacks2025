import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faBook, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="nav">
      <ul className="chat">
        <CustomLink to = "/chat"><div className="navLink"><div className="icon"><FontAwesomeIcon icon={faPencil} size="xl"/></div><span>Chat</span></div>
        </CustomLink>
      </ul>
      <ul className="entries">
      <CustomLink to="/entries"><div className="navLink"><div className="icon"><FontAwesomeIcon icon={faBook} size="xl"/></div><span>Entries</span></div></CustomLink>
      </ul>
      <ul className="calendar">
      <CustomLink to="/calendar"><div className="navLink"><div className="icon"><FontAwesomeIcon icon={faCalendarDays} size="xl"/></div><span>Calendar</span></div></CustomLink>
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