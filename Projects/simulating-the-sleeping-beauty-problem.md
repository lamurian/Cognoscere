---
author:
- Lam
authors:
- Lam
date: 2024-12-16
tags:
- math
- R
- simulation
title: Simulating the sleeping beauty problem
toc-title: Table of contents
---

# Problem

> Some researchers are going to put you to sleep. During the two days
> that your sleep will last, they will briefly wake you up either once
> or twice, depending on the toss of a fair coin (Heads: once; Tails:
> twice). After each waking, they will put you back to sleep with a drug
> that makes you forget that waking. When you are first awakened, to
> what degree ought you believe that the outcome of the coin toss is
> Heads?

![Illustration of the sleeping beauty problem from
Wikipedia](https://upload.wikimedia.org/wikipedia/commons/9/9f/Sleeping_beauty_problem.svg)

# My initial thought

In the original problem, the question was to gauge how much we believe
that the outcome of the coin toss is Heads. How *much* we believe can be
vaguely represented as a 0-100% scale, where 0% stands for "*I don't
believe that the outcome of the coin toss is Heads*", and 100% stands
for otherwise. At first, it seems like a harmless and easy question.
However, the conundrum comes from the condition that:

> After each waking, they will put you back to sleep with a drug that
> makes you forget that waking.

This condition implies that we, as the participant, do not have an
intact recollection of what happened in the previous instance we woke
up. It means that no matter how many times we wake up, we still think
that this is the *first* time we wake up. Horrible! But then, how can we
make a correct estimate to answer the question? First of all, I need to
make several assumptions:

-   The coin is fair, so the ratio of having Heads to Tail is 1:1, hence
    the probability is 0.5
-   The researcher as the observer can observe the "waking up" as many
    times as possible

# How I plan to tackle the problem

I want to look from the observer's perspective. Imagine that we
replicate this experiment in parallel as many times as possible. Each
experiment is independent from one to another. As the observer, I will
collect the data on how many times the participant will wake up
depending on coin flips. If the coin flip returns head, the participant
will wake up once on Monday. If the coin flip returns tail, the
participant will wake up twice on Monday and Tuesday.

In an extreme case of all flips return head, then we can expect the
number of waking-up would be $n$ times, where $n$ correspond to the
number of parallel experiments we have. In another extreme case of all
flips return tail, then we can expect the number waking-up would be $2n$
times. Now, we have the range of extreme cases from $n - 2n$. We can
scale it down to $0 - 1$ to estimate the probability of the coin toss
being tails. To estimate the coin toss being heads, then we can invert
the range later by subtracting it from 1.

# Preparing for the simulation

Let's start by setting up the parallel experiments. Suppose that we are
doing 100 times of similarly conducted experiments. We shall set this as
our parameter `n_obs`. Then we need to set the probability parameter
`prob` as 0.5. Since we only do a one-shot experiment here, we set the
number of trials as 1. One-shot experiment simply means that for each
experiment settings, we only performed it once.

::: cell
``` {.r .cell-code}
n_obs   <- 1e2
prob    <- 0.5
n_trial <- 1
```
:::

# Simulate the occurrence of tails

<div>

> **Note**
>
> I'm doing this simulation in `R`, but you can implement this in other
> languages.

</div>

Now, our experiment sounds more like a Bernoulli trial. In `R`, we can
simulate it using the `rbinom` function. Let's set the seed for
reproducibility and check the first 10 observations and the final 10
observations

::::: cell
``` {.r .cell-code}
set.seed(1810)
is_tail <- rbinom(n = n_obs, prob = prob, size = n_trial)
head(is_tail, n = 10) # The first 10 observations
```

::: {.cell-output .cell-output-stdout}
     [1] 1 1 1 0 1 0 1 1 0 1
:::

``` {.r .cell-code}
tail(is_tail, n = 10) # The last 10 observations
```

::: {.cell-output .cell-output-stdout}
     [1] 1 1 1 1 0 0 0 0 0 0
:::
:::::

# Tally up the number of wake-ups

Now, for every tail, the participant wakes up twice. Otherwise, the
participant wakes up once.

::::: cell
``` {.r .cell-code}
wake_ups <- ifelse(is_tail, 2, 1)
head(wake_ups, n = 10) # The first 10 observations
```

::: {.cell-output .cell-output-stdout}
     [1] 2 2 2 1 2 1 2 2 1 2
:::

``` {.r .cell-code}
tail(wake_ups, n = 10) # The last 10 observations
```

::: {.cell-output .cell-output-stdout}
     [1] 2 2 2 2 1 1 1 1 1 1
:::
:::::

Now, we can tally up the number of wake-ups for all participants.

::::: cell
``` {.r .cell-code}
tally <- table(wake_ups)
tally
```

::: {.cell-output .cell-output-stdout}
    wake_ups
     1  2 
    45 55 
:::

``` {.r .cell-code}
tally / n_obs
```

::: {.cell-output .cell-output-stdout}
    wake_ups
       1    2 
    0.45 0.55 
:::
:::::

The probability of head (wake up once) and tail (wake up twice) is close
to 0.5. This is the rationale behind "the halfer" position. Some people
think that the probability of waking up is directly attributable to the
probability of a fair coin. Thus, it should get closer to 0.5 the more
we replicate the experiments.

If we consider the number of waking twice as the success, we can
simulate random probability drawn from 1,000 simulations using a beta
distribution.

:::: cell
``` {.r .cell-code}
rbeta(n = 1e3, shape1 = tally[[2]], shape2 = tally[[1]]) |>
  hist(main = "", xlab = "Probability of tail", xlim = c(0, 1))
```

::: cell-output-display
![](simulating-the-sleeping-beauty-problem_files/figure-markdown/unnamed-chunk-5-1.png)
:::
::::

# Here be dragons: the thirder position

The halfer position may sound natural when we see it as the observer.
However, seeing is as the participant (the one being put into sleep),
it's not as much clear as we hope it to be. The participant may wake up
once on Monday, or wake up twice on Monday and Tuesday. Therefore, each
day of wake up should have similar probability of $\frac{1}{3}$. But, is
it?

This is what's running in my head when imagining myself as the
participant:

> As the participant, I may wake up on Monday (1), or wake up on Monday
> (1) and Tuesday (1). I have three potential days to wake up. If I
> receive head, then I get to wake up $\frac{1}{3}$ of the times.
> Meanwhile, if I receive tail, then I get to wake up $\frac{2}{3}$ of
> the times. However, I have no information of my previous wake-ups. So,
> even when I receive tail, I wouldn't know if I wake up on Monday and
> Tuesday. Therefore, they are all equally possible!

# Simulate the thirder position

Let's reiterate our previous coin flip experiment, which was simulated
as a Bernoulli trial. Now, we want to tally up based on the day of
waking up. Since all participants will wake up on Monday regardless of
tail and head, we will calculate it twice.

:::: cell
``` {.r .cell-code}
on_monday  <- ifelse(is_tail, 1, 1) |> sum()
on_tuesday <- ifelse(is_tail, 1, 0) |> sum()
total_day  <- on_monday + on_tuesday

total_day
```

::: {.cell-output .cell-output-stdout}
    [1] 155
:::
::::

The `total_day` here represents the total number of days all
participants wake up. Since Monday is an overlap of waking up due to
receiving tail and head, we should attribute the probability to number
of waking up on Tuesday divided by the total number of days.

:::: cell
``` {.r .cell-code}
on_tuesday / total_day
```

::: {.cell-output .cell-output-stdout}
    [1] 0.3548387
:::
::::

If we consider the number of waking up *on* Tuesday as the success, we
can simulate random probability drawn from 1,000 simulations using a
beta distribution.

:::: cell
``` {.r .cell-code}
rbeta(n = 1e3, shape1 = on_tuesday, shape2 = on_monday) |>
  hist(main = "", xlab = "Probability of waking up on Tuesday", xlim = c(-1, 1))
```

::: cell-output-display
![](simulating-the-sleeping-beauty-problem_files/figure-markdown/unnamed-chunk-8-1.png)
:::
::::

As it stands, the thirder position does not directly address the
question: to what degree ought you believe that the outcome of the coin
toss is Heads? The thirder position gauges the belief by assuming that
waking up on Monday due to receiving head, on Monday due to receiving
tail, and on Tuesday due to receiving tail are equally likely.

# Replicate the simulation many, many times

We have seen that the halfer and the thirder positions are two different
perspectives at tackling the sleeping beauty problem. By simulating
many, many times, the difference between these two perspective are more
polarized. Here we create a simulation for 50, 1,000, and 5,000
experiments.

:::: cell
``` {.r .cell-code}
simulate <- function(n_obs, prob, n_trial, seed = 1810) {
  set.seed(seed)
  is_tail <- rbinom(n = n_obs, prob = prob, size = n_trial)
  return(is_tail)
}

list_obs  <- list("n50" = 50, "n100" = 1e2, "n1000" = 1e3)
list_tail <- lapply(list_obs, \(obs) simulate(n_obs = obs, prob = 0.5, n_trial = 1))

str(list_tail)
```

::: {.cell-output .cell-output-stdout}
    List of 3
     $ n50  : int [1:50] 1 1 1 0 1 0 1 1 0 1 ...
     $ n100 : int [1:100] 1 1 1 0 1 0 1 1 0 1 ...
     $ n1000: int [1:1000] 1 1 1 0 1 0 1 1 0 1 ...
:::
::::

Then, we can define the success/fail criteria for the halfer position to
later simulate the beta distribution.

:::: cell
``` {.r .cell-code}
halfer <- function(is_tail) {
  wake_ups <- ifelse(is_tail, 2, 1)
  tally    <- table(wake_ups)
  result   <- list("fail" = tally[[1]], "success" = tally[[2]])
  return(result)
}

halfer_result <- lapply(list_tail, \(is_tail) halfer(is_tail))

str(halfer_result)
```

::: {.cell-output .cell-output-stdout}
    List of 3
     $ n50  :List of 2
      ..$ fail   : int 20
      ..$ success: int 30
     $ n100 :List of 2
      ..$ fail   : int 45
      ..$ success: int 55
     $ n1000:List of 2
      ..$ fail   : int 519
      ..$ success: int 481
:::
::::

Next, we can define the success/fail criteria for the thirder position
to later simulate the beta distribution.

:::: cell
``` {.r .cell-code}
thirder <- function(is_tail) {
  fail    <- ifelse(is_tail, 1, 1) |> sum()
  success <- ifelse(is_tail, 1, 0) |> sum()
  result  <- list("fail" = fail, "success" = success)
  return(result)
}

thirder_result <- lapply(list_tail, \(is_tail) thirder(is_tail))

str(thirder_result)
```

::: {.cell-output .cell-output-stdout}
    List of 3
     $ n50  :List of 2
      ..$ fail   : num 50
      ..$ success: num 30
     $ n100 :List of 2
      ..$ fail   : num 100
      ..$ success: num 55
     $ n1000:List of 2
      ..$ fail   : num 1000
      ..$ success: num 481
:::
::::

Finally, we can plot to see how the simulation goes with different
`n_obs` parameters.

:::::: cell
``` {.r .cell-code}
plot_probability <- function(result, plt_title) {
  prob <- rbeta(n = 1e3, shape1 = result$success, shape2 = result$fail)
  hist(prob, main = plt_title, xlab = "The probability of success", xlim = c(0, 1))
}

par(mfrow = c(2, 3))
mapply(plot_probability, result = halfer_result,  plt_title = names(halfer_result))
```

::: {.cell-output .cell-output-stdout}
             n50        n100      n1000     
    breaks   numeric,11 numeric,8 numeric,12
    counts   integer,10 integer,7 integer,11
    density  numeric,10 numeric,7 numeric,11
    mids     numeric,10 numeric,7 numeric,11
    xname    "prob"     "prob"    "prob"    
    equidist TRUE       TRUE      TRUE      
:::

``` {.r .cell-code}
mapply(plot_probability, result = thirder_result, plt_title = names(thirder_result))
```

::: cell-output-display
![The halfer result on the top, the thirder result on the
bottom](simulating-the-sleeping-beauty-problem_files/figure-markdown/unnamed-chunk-12-1.png)
:::

::: {.cell-output .cell-output-stdout}
             n50       n100       n1000     
    breaks   numeric,9 numeric,13 numeric,18
    counts   integer,8 integer,12 integer,17
    density  numeric,8 numeric,12 numeric,17
    mids     numeric,8 numeric,12 numeric,17
    xname    "prob"    "prob"     "prob"    
    equidist TRUE      TRUE       TRUE      
:::
::::::