import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
} from "@mui/material";

const PaymentForm = () => {
  const [payment, setPayment] = useState("cash");

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D4A373",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: "12px",
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Payment Form
        </Typography>

        <TextField
          fullWidth
          label="Holder Name"
          variant="outlined"
          margin="normal"
        />

        <Typography mt={2}>Select Payment Method</Typography>
        <RadioGroup
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
          <FormControlLabel value="card" control={<Radio />} label="Card" />
        </RadioGroup>

        {payment === "cash" && (
          <TextField label="Amount" fullWidth type="number" border="normal" />
        )}
        {payment === "card" && (
          <>
            <TextField label="Card Number" type="number" />

            <TextField label="CVV Number" type="passwors" />
          </>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#996944",
            "&:hover": {
              backgroundColor: "#6e4c2c",
            },
          }}
        >
          Submit Payment
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentForm;
