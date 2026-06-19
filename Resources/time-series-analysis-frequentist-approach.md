---
title: 'Time Series Analysis: Frequentist Approach'
description: ARIMA, VAR, GARCH, classical decomposition, and forecasting from the frequentist perspective with R and Python
author: pi
editor: lam
date: 2026-06-01T21:09:35.824Z
tags:
  - roadmap
  - statistics
  - advanced
  - frequentist
---
# Time Series Analysis: Frequentist Approach

## Overview

Time series data has temporal dependence — observations close in time are correlated. Frequentist time series methods focus on modelling this dependence using autoregressive and moving average components, with well-established tools for forecasting and inference. Code in R and Python.

## 1. Key Concepts

- Stationarity: Mean, variance, and autocorrelation are constant over time
- Autocorrelation (ACF): Correlation between $y_t$ and $y_{t-k}$
- Partial autocorrelation (PACF): Correlation between $y_t$ and $y_{t-k}$ controlling for intermediate lags
- White noise: $\varepsilon_t \sim N(0, \sigma^2)$, independent, identically distributed

## 2. ARIMA Models

### Autoregressive (AR) — $p$ lags
$$y_t = c + \phi_1 y_{t-1} + \phi_2 y_{t-2} + \ldots + \phi_p y_{t-p} + \varepsilon_t$$

### Moving Average (MA) — $q$ lags
$$y_t = c + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \ldots + \theta_q \varepsilon_{t-q}$$

### ARIMA($p, d, q$)
- $p$: AR order
- $d$: differencing order (to achieve stationarity)
- $q$: MA order

R:
```r
library(forecast)
# Identify order
tsdisplay(data)
# Fit ARIMA
fit <- auto.arima(data, stepwise = FALSE, approximation = FALSE)
summary(fit)
checkresiduals(fit)  # should look like white noise
# Forecast
forecast(fit, h = 12) |> plot()
```

Python:
```python
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.arima.model import ARIMA

# Identify order
plot_acf(data); plot_pacf(data)
plt.show()
# Fit ARIMA
model = ARIMA(data, order=(p, d, q))
fit = model.fit()
print(fit.summary())
# Forecast
forecast = fit.forecast(steps=12)
```

## 3. Seasonal ARIMA (SARIMA)

SARIMA($p,d,q$)$(P,D,Q)_m$ adds:
- $P,D,Q$: seasonal AR, differencing, MA orders
- $m$: number of periods per season (12 for monthly, 4 for quarterly)

R: `auto.arima(data, seasonal = TRUE)`
Python: `from statsmodels.tsa.statespace.sarimax import SARIMAX`

## 4. VAR (Vector Autoregression)

For multivariate time series — each variable depends on lagged values of all variables:

$$y_t = c + \Phi_1 y_{t-1} + \ldots + \Phi_p y_{t-p} + \varepsilon_t$$

R: `library(vars); VAR(data, p = 2)`
Python: `from statsmodels.tsa.vector_ar.var_model import VAR`

## 5. GARCH (Volatility Modelling)

For financial time series with volatility clustering:

$$\sigma^2_t = \omega + \alpha \varepsilon^2_{t-1} + \beta \sigma^2_{t-1}$$

R: `library(rugarch); ugarchspec(variance.model = list(model = "sGARCH"))`
Python: `from arch import arch_model; arch_model(data, vol='Garch', p=1, q=1)`

## 6. Forecasting Evaluation

| Metric | Formula | Notes |
|--------|---------|-------|
| MSE | $\frac{1}{n}\sum(y_t - \hat{y}_t)^2$ | Squared errors |
| MAE | $\frac{1}{n}\sum|y_t - \hat{y}_t|$ | Absolute errors |
| MAPE | $\frac{1}{n}\sum|(y_t - \hat{y}_t)/y_t| \cdot 100$ | Percentage errors |
| MASE | MAE / MAE(naive) | Scale-independent |

R: `accuracy(fit)`
Python: `from sklearn.metrics import mean_squared_error`

## References

- Hyndman, R.J. & Athanasopoulos, G. (2021). Forecasting: Principles and Practice. 3rd ed. OTexts.
- Box, G. et al. (2015). Time Series Analysis: Forecasting and Control. 5th ed. Wiley.
- Hamilton, J. (1994). Time Series Analysis. Princeton.

## Relevant notes

- [Time Series Analysis: Frequentist vs Bayesian Comparison](time-series-analysis-frequentist-vs-bayesian-comparison.md)
- [Time Series Analysis: Bayesian Approach](time-series-analysis-bayesian-approach.md)
- [Descriptive Statistics & Data Visualisation](descriptive-statistics-data-visualisation.md)
- [Causal Inference: Frequentist Approach](causal-inference-frequentist-approach.md)