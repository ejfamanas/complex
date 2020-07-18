import * as React from "react";
import {Link} from "react-router-dom";

export default (): JSX.Element => {
    return (
        <div>
            I'm some other page!
            <Link to="/">Go Back home</Link>
        </div>
    )
}
