import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Stat as ChakraStat,
  StatLabel as ChakraStatLabel,
  StatNumber as ChakraStatNumber,
  Avatar,
  AvatarGroup,
  Box,
  BoxProps,
  SimpleGrid,
  Divider,
  Flex,
  Heading,
  HStack,
  Progress,
  Switch,
  Text,
  useDisclosure,
  useToast,
  Skeleton,
  StatLabelProps,
  StatNumberProps,
  StatProps,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { ModalDivider } from "components/shared/Modal";
import { SwitchCSS } from "components/shared/SwitchCSS";
import { useRari } from "context/RariContext";
import { useAuthedCallback } from "hooks/useAuthedCallback";
import { useBorrowLimit } from "hooks/useBorrowLimit";
import { useFusePoolData } from "hooks/useFusePoolData";
import { useIsSemiSmallScreen } from "hooks/useIsSemiSmallScreen";
import { useTokenData } from "hooks/useTokenData";
import LogRocket from "logrocket";
import { memo, useEffect } from "react";
// Hooks
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
// Utils
import { convertMantissaToAPR, convertMantissaToAPY } from "utils/apyUtils";
import {
  midUsdFormatter,
  shortUsdFormatter,
  smallUsdFormatter,
} from "utils/bigUtils";
import {
  Center,
  Column,
  Row,
  RowOrColumn,
  useIsMobile,
} from "utils/chakraUtils";
import { createComptroller } from "utils/createComptroller";
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";
import CTokenIcon from "./CTokenIcon";
import FuseNavbar from "./FuseNavbar";
import { PoolInfoBox } from "./FusePoolInfoPage";
// import FuseStatsBar from "./FuseStatsBar";
import PoolModal, { Mode } from "./Modals/PoolModal";

import { Link } from "react-router-dom";
import PageTransitionLayout from "components/shared/PageTransitionLayout";

const StatLabel = (props: StatLabelProps) => (
  <ChakraStatLabel
    fontWeight="medium"
    fontFamily="Manrope"
    isTruncated
    color={useColorModeValue("gray.500", "gray.400")}
    {...props}
  />
);

const StatNumber = (props: StatNumberProps) => (
  <ChakraStatNumber
    fontSize={["3xl", "3xl", "2xl", "3xl"]}
    fontWeight="medium"
    fontFamily="Manrope"
    color={useColorModeValue("gray.900", "gray.200")}
    {...props}
  />
);

const Stat = (props: StatProps) => (
  <ChakraStat
    px={{ base: 4, sm: 6 }}
    py="5"
    bg={useColorModeValue("white", "gray.700")}
    fontFamily="Manrope"
    shadow="base"
    rounded="lg"
    {...props}
  />
);

const FusePoolPage = memo(() => {
  const isMobile = useIsSemiSmallScreen();
  const { poolId } = useParams();
  const data = useFusePoolData(poolId);
  const bgColor = useColorModeValue("white", "gray.900");

  return (
    <PageTransitionLayout>
      <Flex
        w="100vw"
        minH="100vh"
        flexDir="column"
        alignItems="flex-start"
        bgColor={bgColor}
        justifyContent="flex-start"
      >
        <FuseNavbar />
        <Divider />
        <HStack
          width="100%"
          my={8}
          mx="auto"
          maxW={{ lg: "1200px" }}
          spacing={6}
          px={{ base: 6, lg: 0 }}
        >
          <Link to="/">
            <ArrowBackIcon fontSize="2xl" fontWeight="extrabold" />
          </Link>

          {data ? (
            <Heading
              lineHeight={1}
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
            >
              {data.name}
            </Heading>
          ) : (
            <Skeleton>hello</Skeleton>
          )}
          {data?.assets && data?.assets?.length > 0 ? (
            <>
              <AvatarGroup size="sm" max={30}>
                {data?.assets.map(
                  ({
                    underlyingToken,
                    cToken,
                  }: {
                    underlyingToken: string;
                    cToken: string;
                  }) => {
                    return (
                      <CTokenIcon key={cToken} address={underlyingToken} />
                    );
                  }
                )}
              </AvatarGroup>
            </>
          ) : null}
        </HStack>
        <Box
          as="section"
          bg={useColorModeValue("gray.50", "gray.900")}
          px="10"
          py="4"
          pb="8"
          width={"100%"}
          display={{ sm: "none", md: "block" }}
        >
          <Box maxW="7xl" mx="auto" px={{ base: "6", md: "8" }}>
            <Heading marginBottom={"2"} fontWeight="semibold" fontSize={"2xl"}>
              Pool Statistics
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing="3">
              <Stat>
                <StatLabel>{"Total Supply"}</StatLabel>
                <StatNumber>
                  {data ? (
                    midUsdFormatter(data.totalSuppliedUSD)
                  ) : (
                    <Skeleton mt="2">Num</Skeleton>
                  )}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>{"Total Borrow"}</StatLabel>
                <StatNumber>
                  {data ? (
                    midUsdFormatter(data?.totalBorrowedUSD)
                  ) : (
                    <Skeleton mt="2">Num</Skeleton>
                  )}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>{"Liquidity"}</StatLabel>
                <StatNumber>
                  {data ? (
                    midUsdFormatter(data?.totalLiquidityUSD)
                  ) : (
                    <Skeleton mt="2">Num</Skeleton>
                  )}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>{"Pool Utilization"}</StatLabel>
                <StatNumber>
                  {data ? (
                    data.totalSuppliedUSD.toString() === "0" ? (
                      "0%"
                    ) : (
                      (
                        (data?.totalBorrowedUSD / data?.totalSuppliedUSD) *
                        100
                      ).toFixed(2) + "%"
                    )
                  ) : (
                    <Skeleton mt="2">Num</Skeleton>
                  )}
                </StatNumber>
              </Stat>
              {/* {[{label: ""}].map(({ label, value }) => (
          <Stat key={label}>
            <StatLabel>{label}</StatLabel>
            <StatNumber>{value}</StatNumber>
          </Stat>
        ))} */}
            </SimpleGrid>
          </Box>
        </Box>
        {
          /* If they have some asset enabled as collateral, show the collateral ratio bar */
          data && data.assets.some((asset) => asset.membership) ? (
            <CollateralRatioBar
              assets={data.assets}
              borrowUSD={data.totalBorrowBalanceUSD}
            />
          ) : null
        }
        <RowOrColumn
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          maxW={{ lg: "1200px" }}
          bgColor={bgColor}
          px={{ base: 6, lg: 0 }}
          mx="auto"
          mt={4}
          isRow={!isMobile}
        >
          <PoolDashboardBox width={isMobile ? "100%" : "50%"}>
            {data ? (
              <SupplyList
                assets={data.assets}
                comptrollerAddress={data.comptroller}
                supplyBalanceUSD={data.totalSupplyBalanceUSD}
              />
            ) : (
              <TableSkeleton tableHeading="Supply Balance" />
            )}
          </PoolDashboardBox>

          <PoolDashboardBox
            ml={isMobile ? 0 : 4}
            mt={isMobile ? 4 : 0}
            width={isMobile ? "100%" : "50%"}
          >
            {data ? (
              <BorrowList
                comptrollerAddress={data.comptroller}
                assets={data.assets}
                borrowBalanceUSD={data.totalBorrowBalanceUSD}
              />
            ) : (
              <TableSkeleton tableHeading="Borrow Balance" />
            )}
          </PoolDashboardBox>
        </RowOrColumn>
        <PoolInfoBox data={data} />
        <Box h={"20"}></Box>
      </Flex>
    </PageTransitionLayout>
  );
});

export default FusePoolPage;

export const PoolDashboardBox = ({ children, ...props }: BoxProps) => {
  return (
    <Box
      backgroundColor={useColorModeValue("white", "#21262e")}
      borderRadius="10px"
      border="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      boxShadow={useColorModeValue(
        "0px 21px 44px rgba(71, 29, 97, 0.105141)",
        "0px 2px 44px rgb(71 29 97 / 29%)"
      )}
      _hover={{
        boxShadow: useColorModeValue(
          "0px 3px 29px rgb(71 0 97 / 21%)",
          "0px 5px 44px rgb(242 21 139 / 19%)"
        ),
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const CollateralRatioBar = ({
  assets,
  borrowUSD,
}: {
  assets: USDPricedFuseAsset[];
  borrowUSD: number;
}) => {
  const { t } = useTranslation();

  const maxBorrow = useBorrowLimit(assets);

  const ratio = (borrowUSD / maxBorrow) * 100;

  useEffect(() => {
    if (ratio > 95) {
      LogRocket.track("Fuse-AtRiskOfLiquidation");
    }
  }, [ratio]);

  return (
    <PoolDashboardBox
      width={{ base: "90%", md: "95%", lg: "100%" }}
      maxW={{ lg: "1200px" }}
      height="65px"
      mt={4}
      p={4}
      mx="auto"
    >
      <Row mainAxisAlignment="flex-start" crossAxisAlignment="center" expand>
        <Tooltip
          label={t("Keep this bar from filling up to avoid being liquidated!")}
        >
          <Text flexShrink={0} mr={4}>
            {t("Borrow Limit")}
          </Text>
        </Tooltip>

        <Tooltip label={t("This is how much you have borrowed.")}>
          <Text flexShrink={0} mt="2px" mr={3} fontSize="10px">
            {smallUsdFormatter(borrowUSD)}
          </Text>
        </Tooltip>

        <Tooltip
          label={`You're using ${ratio.toFixed(1)}% of your ${smallUsdFormatter(
            maxBorrow
          )} borrow limit.`}
        >
          <Box width="100%">
            <Progress
              size="xs"
              width="100%"
              colorScheme={
                ratio <= 40
                  ? "whatsapp"
                  : ratio <= 60
                  ? "yellow"
                  : ratio <= 80
                  ? "orange"
                  : "red"
              }
              borderRadius="10px"
              value={ratio}
            />
          </Box>
        </Tooltip>

        <Tooltip
          label={t(
            "If your borrow amount reaches this value, you will be liquidated."
          )}
        >
          <Text flexShrink={0} mt="2px" ml={3} fontSize="10px">
            {smallUsdFormatter(maxBorrow)}
          </Text>
        </Tooltip>
      </Row>
    </PoolDashboardBox>
  );
};

const SupplyList = ({
  assets,
  supplyBalanceUSD,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  supplyBalanceUSD: number;
  comptrollerAddress: string;
}) => {
  const { t } = useTranslation();

  const suppliedAssets = assets.filter((asset) => asset.supplyBalanceUSD > 1);
  const nonSuppliedAssets = assets.filter(
    (asset) => asset.supplyBalanceUSD < 1
  );

  const isMobile = useIsMobile();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height="100%"
      pb={1}
    >
      <Heading size="md" px={4} py={3}>
        {t("Supply Balance:")} {smallUsdFormatter(supplyBalanceUSD)}
      </Heading>

      <Divider color="#F4F6F9" />

      {assets.length > 0 ? (
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          width="100%"
          px={4}
          mt={4}
        >
          <Text width="27%" fontWeight="bold" pl={1}>
            {t("Asset")}
          </Text>

          {isMobile ? null : (
            <Text width="27%" fontWeight="bold" textAlign="right">
              {t("APY/LTV")}
            </Text>
          )}

          <Text
            width={isMobile ? "40%" : "27%"}
            fontWeight="bold"
            textAlign="right"
          >
            {t("Balance")}
          </Text>

          <Text
            width={isMobile ? "34%" : "20%"}
            fontWeight="bold"
            textAlign="right"
          >
            {t("Collateral")}
          </Text>
        </Row>
      ) : null}

      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        expand
        mt={1}
      >
        {assets.length > 0 ? (
          <>
            {suppliedAssets.map((asset, index) => {
              return (
                <AssetSupplyRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={suppliedAssets}
                  index={index}
                />
              );
            })}

            {suppliedAssets.length > 0 ? <ModalDivider my={2} /> : null}

            {nonSuppliedAssets.map((asset, index) => {
              return (
                <AssetSupplyRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={nonSuppliedAssets}
                  index={index}
                />
              );
            })}
          </>
        ) : (
          <Center expand my={8}>
            {t("There are no assets in this pool.")}
          </Center>
        )}
      </Column>
    </Column>
  );
};

const AssetSupplyRow = ({
  assets,
  index,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  index: number;
  comptrollerAddress: string;
}) => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const authedOpenModal = useAuthedCallback(openModal);

  const asset = assets[index];

  const { fuse, address } = useRari();

  const tokenData = useTokenData(asset.underlyingToken);

  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);

  const queryClient = useQueryClient();

  const toast = useToast();

  const onToggleCollateral = async () => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    let call;
    if (asset.membership) {
      call = comptroller.methods.exitMarket(asset.cToken);
    } else {
      call = comptroller.methods.enterMarkets([asset.cToken]);
    }

    let response = await call.call({ from: address });
    // For some reason `response` will be `["0"]` if no error but otherwise it will return a string number.
    if (response[0] !== "0") {
      if (asset.membership) {
        toast({
          title: "Error! Code: " + response,
          description:
            "You cannot disable this asset as collateral as you would not have enough collateral posted to keep your borrow. Try adding more collateral of another type or paying back some of your debt.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Error! Code: " + response,
          description:
            "You cannot enable this asset as collateral at this time.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }

      return;
    }

    await call.send({ from: address });

    LogRocket.track("Fuse-ToggleCollateral");

    queryClient.refetchQueries();
  };

  const isStakedOHM =
    asset.underlyingToken.toLowerCase() ===
    "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F".toLowerCase();

  const { data: stakedOHMApyData } = useQuery("sOHM_APY", async () => {
    const data = (
      await fetch("https://api.rari.capital/fuse/pools/18/apy")
    ).json();

    return data as Promise<{ supplyApy: number; supplyWpy: number }>;
  });

  const isMobile = useIsMobile();

  const { t } = useTranslation();

  return (
    <>
      <PoolModal
        defaultMode={Mode.SUPPLY}
        comptrollerAddress={comptrollerAddress}
        assets={assets}
        index={index}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        width="100%"
        px={4}
        py={1.5}
        _hover={{
          bgColor: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          width="27%"
          as="button"
          onClick={authedOpenModal}
        >
          <Avatar
            bg="#FFF"
            boxSize="37px"
            name={asset.underlyingSymbol}
            src={
              tokenData?.logoURL ??
              "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
            }
          />
          <Text fontWeight="bold" fontSize="lg" ml={2} flexShrink={0}>
            {tokenData?.symbol ?? asset.underlyingSymbol}
          </Text>
        </Row>

        {isMobile ? null : (
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-end"
            width="27%"
            as="button"
            onClick={authedOpenModal}
          >
            <Text
              color={tokenData?.color ?? "#FF"}
              fontWeight="bold"
              fontSize="17px"
            >
              {isStakedOHM
                ? stakedOHMApyData
                  ? (stakedOHMApyData.supplyApy * 100).toFixed(3)
                  : "?"
                : supplyAPY.toFixed(3)}
              %
            </Text>

            <Tooltip
              label={t(
                "The Loan to Value (LTV) ratio defines the maximum amount of tokens in the pool that can be borrowed with a specific collateral. It’s expressed in percentage: if in a pool ETH has 75% LTV, for every 1 ETH worth of collateral, borrowers will be able to borrow 0.75 ETH worth of other tokens in the pool."
              )}
            >
              <Text fontSize="sm">{asset.collateralFactor / 1e16}% LTV</Text>
            </Tooltip>
          </Column>
        )}

        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-end"
          width={isMobile ? "40%" : "27%"}
          as="button"
          onClick={authedOpenModal}
        >
          <Text
            color={tokenData?.color ?? "#FFF"}
            fontWeight="bold"
            fontSize="17px"
          >
            {smallUsdFormatter(asset.supplyBalanceUSD)}
          </Text>

          <Text fontSize="sm">
            {smallUsdFormatter(
              asset.supplyBalance / 10 ** asset.underlyingDecimals
            ).replace("$", "")}{" "}
            {tokenData?.symbol ?? asset.underlyingSymbol}
          </Text>
        </Column>

        <Row
          width={isMobile ? "34%" : "20%"}
          mainAxisAlignment="flex-end"
          crossAxisAlignment="center"
        >
          <SwitchCSS symbol={asset.underlyingSymbol} color={tokenData?.color} />

          <Switch
            isChecked={asset.membership}
            className={asset.underlyingSymbol + "-switch"}
            onChange={onToggleCollateral}
            size="md"
            mt={1}
            mr={5}
          />
        </Row>
      </Row>
    </>
  );
};

const BorrowList = ({
  assets,
  borrowBalanceUSD,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  borrowBalanceUSD: number;
  comptrollerAddress: string;
}) => {
  const { t } = useTranslation();
  const borrowedAssets = assets.filter((asset) => asset.borrowBalanceUSD > 1);
  const nonBorrowedAssets = assets.filter(
    (asset) => asset.borrowBalanceUSD < 1
  );

  const isMobile = useIsMobile();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height="100%"
      pb={1}
    >
      <Heading size="md" px={4} py={3}>
        {t("Borrow Balance:")} {smallUsdFormatter(borrowBalanceUSD)}
      </Heading>

      <Divider color="#F4F6F9" />

      {assets.length > 0 ? (
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          width="100%"
          px={4}
          mt={4}
        >
          <Text width="27%" fontWeight="bold" pl={1}>
            {t("Asset")}
          </Text>

          {isMobile ? null : (
            <Text width="27%" fontWeight="bold" textAlign="right">
              {t("APR/TVL")}
            </Text>
          )}

          <Text
            fontWeight="bold"
            textAlign="right"
            width={isMobile ? "40%" : "27%"}
          >
            {t("Balance")}
          </Text>

          <Text
            fontWeight="bold"
            textAlign="right"
            width={isMobile ? "34%" : "20%"}
          >
            {t("Liquidity")}
          </Text>
        </Row>
      ) : null}

      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        expand
        mt={1}
      >
        {assets.length > 0 ? (
          <>
            {borrowedAssets.map((asset, index) => {
              // Don't show paused assets.
              if (asset.isPaused) {
                return null;
              }

              return (
                <AssetBorrowRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={borrowedAssets}
                  index={index}
                />
              );
            })}

            {borrowedAssets.length > 0 ? <ModalDivider my={2} /> : null}

            {nonBorrowedAssets.map((asset, index) => {
              // Don't show paused assets.
              if (asset.isPaused) {
                return null;
              }

              return (
                <AssetBorrowRow
                  comptrollerAddress={comptrollerAddress}
                  key={asset.underlyingToken}
                  assets={nonBorrowedAssets}
                  index={index}
                />
              );
            })}
          </>
        ) : (
          <Center expand my={8}>
            {t("There are no assets in this pool.")}
          </Center>
        )}
      </Column>
    </Column>
  );
};

const AssetBorrowRow = ({
  assets,
  index,
  comptrollerAddress,
}: {
  assets: USDPricedFuseAsset[];
  index: number;
  comptrollerAddress: string;
}) => {
  const asset = assets[index];

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const authedOpenModal = useAuthedCallback(openModal);

  const tokenData = useTokenData(asset.underlyingToken);

  const borrowAPR = convertMantissaToAPR(asset.borrowRatePerBlock);

  const { t } = useTranslation();

  const isMobile = useIsMobile();

  return (
    <>
      <PoolModal
        comptrollerAddress={comptrollerAddress}
        defaultMode={Mode.BORROW}
        assets={assets}
        index={index}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        width="100%"
        px={4}
        _hover={{
          bgColor: useColorModeValue("gray.200", "gray.700"),
        }}
        py={1.5}
        as="button"
        onClick={authedOpenModal}
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          width="27%"
        >
          <Avatar
            bg="#FFF"
            boxSize="37px"
            name={asset.underlyingSymbol}
            src={
              tokenData?.logoURL ??
              "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
            }
          />
          <Text fontWeight="bold" fontSize="lg" ml={2} flexShrink={0}>
            {tokenData?.symbol ?? asset.underlyingSymbol}
          </Text>
        </Row>

        {isMobile ? null : (
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-end"
            width="27%"
          >
            <Text
              color={tokenData?.color ?? "#FF"}
              fontWeight="bold"
              fontSize="17px"
            >
              {borrowAPR.toFixed(3)}%
            </Text>

            <Tooltip
              label={t(
                "Total Value Lent (TVL) measures how much of this asset has been supplied in total. TVL does not account for how much of the lent assets have been borrowed, use 'liquidity' to determine the total unborrowed assets lent."
              )}
            >
              <Text fontSize="sm">
                {shortUsdFormatter(asset.totalSupplyUSD)} TVL
              </Text>
            </Tooltip>
          </Column>
        )}

        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-end"
          width={isMobile ? "40%" : "27%"}
        >
          <Text
            color={tokenData?.color ?? "#FFF"}
            fontWeight="bold"
            fontSize="17px"
          >
            {smallUsdFormatter(asset.borrowBalanceUSD)}
          </Text>

          <Text fontSize="sm">
            {smallUsdFormatter(
              asset.borrowBalance / 10 ** asset.underlyingDecimals
            ).replace("$", "")}{" "}
            {tokenData?.symbol ?? asset.underlyingSymbol}
          </Text>
        </Column>

        <Tooltip
          label={t(
            "Liquidity is the amount of this asset that is available to borrow (unborrowed). To see how much has been supplied and borrowed in total, navigate to the Pool Info tab."
          )}
          placement="top-end"
        >
          <Box width={isMobile ? "34%" : "20%"}>
            <Column
              mainAxisAlignment="flex-start"
              crossAxisAlignment="flex-end"
            >
              <Text
                color={tokenData?.color ?? "#FFF"}
                fontWeight="bold"
                fontSize="17px"
              >
                {shortUsdFormatter(asset.liquidityUSD)}
              </Text>

              <Text fontSize="sm">
                {shortUsdFormatter(
                  asset.liquidity / 10 ** asset.underlyingDecimals
                ).replace("$", "")}{" "}
                {tokenData?.symbol}
              </Text>
            </Column>
          </Box>
        </Tooltip>
      </Row>
    </>
  );
};

const TableSkeleton = ({ tableHeading }: any) => (
  <Column
    mainAxisAlignment="flex-start"
    crossAxisAlignment="flex-start"
    height="100%"
    pb={1}
  >
    <Heading size="md" px={4} py={3}>
      {tableHeading}: <Skeleton display="inline">Loading</Skeleton>
    </Heading>

    <Divider color="#F4F6F9" />

    <Skeleton w="100%" h="40" />
  </Column>
);
