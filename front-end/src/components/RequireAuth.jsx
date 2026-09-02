import { getCurrentSession } from "../api/session";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";


export default function RequireAuth ({role, children}) {


    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [canAccess, setCanAccess] = useState(false);

    useEffect(() => {
        async function hasAcess() {
           try { 
            const session = await getCurrentSession();

            if(!session.loggedIn) {
                navigate("/login");
                return;
            }

            if(role){
                let isRole;

                if (Array.isArray(role)) {
                    isRole = role.includes(session.user.role);
                } else {
                    isRole = session.user.role == role;

                }

                if (!isRole) {
                    navigate("/");
                    return;
                }
            }


            setCanAccess(true);

           }catch (error) {
            console.log(error);
            navigate("/");
           } finally {
            setIsLoading(false);
           }
        }   
        
        hasAcess();
    }, []);


    if (isLoading) {
        return <p>Loading...</p>
    }

    if (!canAccess) {
        return null;
    }

    return children;
}