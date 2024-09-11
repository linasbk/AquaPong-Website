import Link from "next/link";
const NotFoundButton = ({ children }) => {
    return (
            <Link className="cursor-pointer text-2xl text-my-cyan hover:text-my-grey hover:shadow-my-grey  shadow-my-cyan shadow-sm" href="/landingPage">
                    {children}
            </Link>
    );
};

export default NotFoundButton;
