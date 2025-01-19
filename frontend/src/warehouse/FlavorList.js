import React from "react";
import { FixedSizeList as List } from "react-window";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import {ListItemSecondaryAction} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SquareButton from "./Utils/SquareButton";
import SquareTextField from "./Utils/SquareTextField";
import Stack from "@mui/material/Stack";

const flavors = [
    { name: "Vanilla", description: "Classic and creamy vanilla flavor." },
    { name: "Chocolate", description: "Rich and smooth chocolate flavor." },
    { name: "Strawberry", description: "Sweet and fruity strawberry flavor." },
    { name: "Mint", description: "Refreshing mint flavor with a hint of coolness." },
    { name: "Cookie Dough", description: "Chunks of cookie dough in a creamy base." },
    { name: "Pistachio", description: "Nutty and creamy pistachio flavor." },
    { name: "Mango", description: "Tropical and juicy mango flavor." },
    { name: "Coffee", description: "Bold and aromatic coffee flavor." },
    { name: "Lemon", description: "Tangy and zesty lemon flavor." },
    { name: "Caramel", description: "Sweet and buttery caramel flavor." },
    { name: "Blueberry", description: "Fresh and fruity blueberry flavor." },
    { name: "Peanut Butter", description: "Rich and creamy peanut butter flavor." },
    { name: "Coconut", description: "Smooth and tropical coconut flavor." },
    { name: "Raspberry", description: "Tart and sweet raspberry flavor." },
    { name: "Green Tea", description: "Earthy and refreshing green tea flavor." },
    { name: "Cookies and Cream", description: "Creamy base with chunks of cookies." },
    { name: "Blackberry", description: "Juicy and sweet blackberry flavor." },
    { name: "Pumpkin Spice", description: "Warm and spiced pumpkin flavor." },
    { name: "Salted Caramel", description: "Sweet caramel with a hint of salt." },
    { name: "Hazelnut", description: "Nutty and smooth hazelnut flavor." },
];

const Row = ({ index, style }) => (
    <ListItem style={style}>
        <Box display="flex" justifyContent="space-between" width="100%" gap="16px">
            <ListItemText
                primary={flavors[index].name}
                secondary={flavors[index].description}
            />
            <Stack direction={"row"} spacing={1} alignItems="center" justifyContent="center">
                <SquareButton variant={"outlined"} size={"2rem"}>-</SquareButton>
                <SquareTextField size={"3rem"} type={"number"} min={0} max={3} value={0} />
                <SquareButton variant={"outlined"} size={"2rem"}>+</SquareButton>
            </Stack>
        </Box>
    </ListItem>
);

export default function FlavorList() {
    return (
        <List
            height={400}
            itemCount={flavors.length}
            itemSize={100}
            width={"100%"}
        >
            {Row}
        </List>
    );
}