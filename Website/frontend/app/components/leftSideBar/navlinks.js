import { IoMdHome, IoIosChatbubbles } from "react-icons/io";
import { FaGamepad, FaUserCircle } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

export const getNavLinks = (user) => [
  { href: '/homePage', icon: IoMdHome, label: 'Home', alt: 'home'},
  { href: '/chatPage', icon: IoIosChatbubbles, label: 'Chat', alt: 'chat'},
  { href: '/gamePage', icon: FaGamepad, label: 'Games', alt: 'games'},
  { href: `/profilePage/${user}`, icon: FaUserCircle, label: 'Profile', alt: 'profile'},
  { href: '/clanPage', icon: HiUserGroup, label: 'Clan', alt: 'clan'}
];
