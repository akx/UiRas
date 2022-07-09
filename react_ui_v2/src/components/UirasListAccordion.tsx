import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { CircularProgress } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import React from "react";

import { GetUirasResponse, UirasFeature } from "../types/UiRaSGeoJSON";
import { PlotyGraph2 } from "./PlotyGraph2";
import TimeSince from "./TimeSince";
import React from "react";
import { useQueryGetUiras } from "./api";

/**
 * Styled strings in grid rows
 */
const UirasName = styled.div(() => ({
  fontSize: "100%",
  fontWeight: "bold",
  textAlign: "left",
}));

const UirasLocation = styled.div(() => ({
  fontSize: "60%",
  textAlign: "left",
}));

const Temperature = styled.div(() => ({
  fontWeight: "bold",
}));

const Moment = styled.div(() => ({
  fontSize: "60%",
}));

const UirasBroken = styled.div(() => ({
  fontSize: "100%",
  fontWeight: "bold",
  border: "red 2px dotted",
  backgroundColor: "yellow",
  padding: "5px",
}));

function Slot({ id, properties }: UirasFeature): JSX.Element {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} key={id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item xs={8} p={0}>
            <UirasName className="text-truncate">{properties.name}</UirasName>
            <UirasLocation className="text-truncate">
              {properties.location}
              {properties.location ? ", " : ""}
              {properties.district}
            </UirasLocation>
          </Grid>
          <Grid item xs={4}>
            <Temperature>
              {properties.temp_water.toFixed(1)}
              °C
              {properties.temp_water < -1.0 ? <ErrorOutlineRoundedIcon /> : ""}
            </Temperature>
            <Moment className="text-truncate">
              <TimeSince iso8601={properties.time} />
            </Moment>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {properties.temp_water < -1.0 ? (
          <UirasBroken>
            Mittari on rikki. Tämä on tiedossa eikä siitä tarvitse erikseen
            ilmoittaa, kiitos.
          </UirasBroken>
        ) : (
          ""
        )}
        <PlotyGraph2 item={id} />
      </AccordionDetails>
    </Accordion>
  );
}

function SlotList({ features }: GetUirasResponse): JSX.Element {
  const sortedFeatures = React.useMemo(
    () =>
      [...features].sort((a, b) =>
        a.properties.name.localeCompare(b.properties.name)
      ),
    [features]
  );
  return (
    <>
      {sortedFeatures.map((feature) => (
        <Slot
          key={feature.id}
          id={feature.id}
          properties={feature.properties}
          geometry={feature.geometry}
        />
      ))}
    </>
  );
}

export default function UirasListAccordion(): JSX.Element {
  const uirasQuery = useQueryGetUiras();
  return (
    <div>
      {uirasQuery.isLoading && <CircularProgress />}
      {uirasQuery.isError && <div>Virhe ladattaessa dataa :(</div>}
      {uirasQuery.isSuccess && <SlotList features={uirasQuery.data.features} />}
    </div>
  );
}
