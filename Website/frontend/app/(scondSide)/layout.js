import LeftSideBar from '../components/leftSideBar/LeftSideBar'
import RightSideBar from '../components/rightSideBar/rightSideBar'
import './second.css'
import Avatar from "../components/Avatar/avatar";
import ChoseModeContext from '../contexts/gameSelectContext';
import Notification from '../components/notification/notification';
import Title from '../components/pageTitle/title';
import SearchForm from '../components/searchBar/SearchBar';
import AuthWrapper from '../components/authWrapper/authWrapper';

const AuthenticatedLayout = ({ children }) => {

    return (
        <>
        <AuthWrapper>

                <Avatar image="/tema.png" height={60} width={60} />
                <div className="navBar ">
                    <SearchForm placeholder="Search friends..." />
                    <Title/>
                    <Notification/>
                </div>
                <RightSideBar/>
                <LeftSideBar/> 
                <ChoseModeContext>
                    {children}
                </ChoseModeContext>
        </AuthWrapper>
        </>
    );
};

export default AuthenticatedLayout;