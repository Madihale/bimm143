Class 7 functions and packages
================
Madison Hale
1/29/2019

Functions revisted
------------------

``` r
#importing example functions from slides
source("http://tinyurl.com/rescale-R")
```

trying **rescale()** function out

``` r
rescale( c(1,5,10) )
```

    ## [1] 0.0000000 0.4444444 1.0000000

Trying **rescale2()** with the **stop()** function catch for a non-numeric input

``` r
#rescale2( c(1:5, "word"))
```

performed a google search on how to find NA values in R code
============================================================

``` r
x <-  c(3,7, NA,4,8)
which(is.na(x))
```

    ## [1] 3

``` r
#lets define an example x and y

x <- c( 1, 2, NA, 3, NA)
y <- c( NA, 3, NA, 3, 4)
y2 <- c(1, NA, NA, NA)
```

``` r
is.na(x)
```

    ## [1] FALSE FALSE  TRUE FALSE  TRUE

``` r
sum(is.na(x))
```

    ## [1] 2

``` r
is.na(x)
```

    ## [1] FALSE FALSE  TRUE FALSE  TRUE

``` r
is.na(y)
```

    ## [1]  TRUE FALSE  TRUE FALSE FALSE

``` r
is.na(x) & is.na(y)
```

    ## [1] FALSE FALSE  TRUE FALSE FALSE

``` r
#putting together
sum( is.na(x) & is.na(y))
```

    ## [1] 1

Take my working snippet and make our first function...

``` r
both.na <- function(x,y) {
  sum( is.na(x) & is.na(y))
}

both_na(x,y)
```

    ## [1] 1

``` r
x <- c(NA, NA, NA)
y1 <- c( 1, NA, NA)
y2 <- c( 1, NA, NA, NA)
y3 <- c( 1, NA, NA, NA, NA)
both_na(x, y2)
```

    ## Warning in is.na(x) & is.na(y): longer object length is not a multiple of
    ## shorter object length

    ## [1] 3

``` r
both_na(x, y3)
```

    ## Warning in is.na(x) & is.na(y): longer object length is not a multiple of
    ## shorter object length

    ## [1] 4

Trying out new, improved both\_na2 function

``` r
# both_na2(x, y2)
# both_na2(x, y3)
# 
# both_na3(x, y1)
```

And trying both\_na3 function

``` r
both_na3(x, y1)
```

    ## Found 2 NA's at position(s):2, 3

    ## $number
    ## [1] 2
    ## 
    ## $which
    ## [1] 2 3

BLOGDOWN blogdown::new\_site("tmp")
