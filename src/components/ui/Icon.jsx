import { FaUsers } from "react-icons/fa6";
import { FaFile } from "react-icons/fa6";

export const Users = ({color = "#000000", size="20"  }) => {
    return <FaUsers style={{ color, width: `${size}px` }} />
}

export const File = ({color = "#000000", size="20"  }) => {
    return <FaFile style={{ color, width: `${size}px` }} />
}