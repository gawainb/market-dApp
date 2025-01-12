import { Avatar } from "@chakra-ui/react";
import { useTokenData } from "hooks/useTokenData";

const CTokenIcon = ({
  address,
  ...avatarProps
}: {
  address: string;
  [key: string]: any;
}) => {
  const tokenData = useTokenData(address);

  return (
    <Avatar
      {...avatarProps}
      key={address}
      bg="#FFF"
      borderWidth="1px"
      name={tokenData?.symbol ?? "Loading..."}
      src={
        tokenData?.logoURL ??
        "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
      }
    />
  );
};

export default CTokenIcon;
