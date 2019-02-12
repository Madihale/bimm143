#' ---
#' title: "Class 5: R Graphics Intro"
#' author: "Madison Hale"
#' date: "January 22, 2019"
#' output: github_document
#' ---

# Class 05 R graphics intro

# My first boxplot

x <-  rnorm(1000,0)
boxplot(x) 

summary(x)
hist(x)

boxplot(x, horizontal = TRUE)

# Hands on Session 2

# 2A: Line Plot
?read.table()

read.table("bimm143_05_rstats/weight_chart.txt")

weight <- read.table("bimm143_05_rstats/weight_chart.txt", header = TRUE)

plot(weight, pch=15, cex=1.5, lwd=2, ylim=c(2,10), xlab="Age (months)", ylab="Weight (kg)", main="Baby Weight over Time")

# 2B: Barplot
# feature_counts.txt: features of different types in the mouse GRCm38 genome (tab separated: "\t!")

?read.table

mouse <- read.table("bimm143_05_rstats/feature_counts.txt", sep="\t", header = TRUE)
mouse

?barplot
barplot(mouse$Count)

barplot(mouse$Count, names.arg=mouse$Feature, horiz=TRUE, ylab="", main="Features in Mouse Genome", las=1, xlim=c(0,80000))

# adjusting margins...par = graphical parameters
?par
par()$mar
par(mar=c(3.1, 11.1, 4.1, 2))

# 2C: Histograms

hist(rnorm(1:1000))
hist(c(rnorm(10000),rnorm(10000)+4), breaks = 20)

# Hands on Session 3: Using COLOR!

# 3A: providing color vectors

?read.table()

male_female <- read.table("bimm143_05_rstats/male_female_counts.txt", header = TRUE, sep="\t")

barplot(male_female$Count, col=rainbow(20))
barplot(male_female$Count, names.arg = male_female$Sample, col=rainbow(nrow(male_female)), las=2, ylab="Counts")
barplot(male_female$Count, names.arg = male_female$Sample, col=c("purple4", "purple1"), las=2, ylab="Counts")
?rainbow()

# 3B: Coloring by Value

genes <- read.table("bimm143_05_rstats/up_down_expression.txt", header = TRUE, sep="\t")
genes
summary(genes)

#how many genes
nrow(genes)

#how many up/down/unchanging
genes$State
table(genes$State)

#plot
palette(c("red", "lightgray","blue"))
plot(genes$Condition1, genes$Condition2, col = genes$State)
 
# colors() gives a list of color options

sessionInfo()
