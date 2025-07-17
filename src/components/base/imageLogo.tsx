import logo from "@/../public/logo.png";
export default function ImageLogo({width}:{width: number}){
    return (
        <img 
            width={width}
            src={logo.src} 
            alt="learnify logo" 
        />
    )
}