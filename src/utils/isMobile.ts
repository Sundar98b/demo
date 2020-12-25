import useMedia from "use-media";

const isMobile = useMedia("(max-width: 767px)") ? true : false;

export { isMobile };
