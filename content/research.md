---
title: Research
description: Microbial communities, disordered systems, and learning from physical models.
---

My interests are in mathematical descriptions of complex systems, particularly at the intersection of theoretical biophysics and condensed matter. I also develop machine-learning methods to make nuclear calculations more useful and less expensive.

I’m interested in what careful inspection of data can reveal before an analysis begins. Systematic discrepancies can mislead us, but they can also expose the limits of a model or point toward a new question.

## Current work

### NOV 2026–PRESENT | Trait interactions in microbial consumer–resource models

*With Mikhail Tikhonov, Washington University in St. Louis.*

How do interactions between microbial traits shape the abundances of species and the resources available to them? I’m planning a cavity-method analysis of this question in the Moran–Tikhonov consumer–resource model.

### SEP 2026–PRESENT | Genomic analysis of conditional auxotrophy

*With Mikhail Tikhonov, in collaboration with Seppe Kuehn’s group at the University of Chicago.*

Can a bacterium’s genome tell us which amino acids it needs from its environment? I used a GapMind-based genome-analysis approach to predict these requirements and compared the predictions with experimental measurements.

The genome-based predictions missed many of the experimentally observed requirements. This discrepancy identifies a limitation of the approach and motivates a closer look at the relationship between genetic potential and nutritional dependence.

### SEP 2026–PRESENT | Local optimization in three-spin glasses

*With Zohar Nussinov, Washington University in St. Louis.*

How well can the lowest-energy configuration of a disordered spin system be inferred from local information? I implemented a local solver for the Baxter–Wu spin glass and benchmarked its predictions against exact solutions for 2,000 random coupling realizations, using integer programming and tensor-network methods.

Over the sizes studied, increasing the locally solved region improved prediction accuracy more slowly for three-spin interactions than for pairwise interactions. A manuscript is in preparation.

### MAY 2026–PRESENT | Machine-learned emulators for nuclear response densities

*With Saori Pastore and Alex Gnech, Washington University in St. Louis.*

Nuclear responses in lepton scattering are expensive to calculate. I led the design and implementation of a neural-network emulator trained on quantum Monte Carlo calculations in the short-time approximation.

Using only three simulated momentum transfers for training, the emulator reduced prediction error for longitudinal and transverse helium responses by 71–78% relative to an interpolation baseline, evaluated at held-out momentum transfers.

I also implemented an approach combining principal component analysis and Gaussian processes to identify where an additional simulation would be most informative. The next step is a workflow that requests simulations until a chosen uncertainty threshold is reached.

## Selected earlier work

### SEP 2025–SEP 2026 | Generative modeling of beam-induced backgrounds

*Lawrence Berkeley National Laboratory, remotely; U.S. Muon Collider Collaboration. With Angira Rastogi and Simone Pagan Griso.*

I built a generative adversarial network trained on FLUKA simulations to test a lower-cost source of beam-induced backgrounds for downstream Geant4 detector simulations. I compared generated samples with FLUKA using single-particle kinematics and correlations within particle families.

The model reproduced several kinematic distributions and the relative fractions of electrons, neutrons, and photons, with discrepancies in particle positions and rare species. I also evaluated a correlation-preserving oversampling method and found no appreciable difference relative to the existing approach.

### SEP 2024–APR 2025 | Hamiltonian lattice QED in 2 + 1 dimensions

*Senior thesis, Princeton University. With Silviu Pufu.*

I derived a lattice Hamiltonian from prior work, characterized its representations, and implemented the model in Mathematica. On a $2\times2$ lattice, I reproduced perturbative results for ground-state energy, the fermion bilinear, and mass gaps, and estimated how the Hilbert-space size scales under an electric-field cutoff.

### JUN–JUL 2024 | Calorimeter biases in the CMS Level-1 trigger

*Research internship, CERN. With Isobel Ojalvo and Andrew Loeliger.*

I generated calorimeter energy-deposit patterns to probe the CICADA algorithm and identified small systematic biases consistent with tower miscalibration. I also explored how the analysis could be adapted to machine-learning triggers in other experiments.

### JAN–APR 2024 | Large-order quantum-mechanical correlation functions

*Junior paper, Princeton University. With Simone Giombi.*

Using instanton calculus in $0+1$ dimensions, I studied the large-order behavior of correlation functions in a toy model. I derived arbitrary-order results for the one-point function and simplified the second-order calculation for the two-point function.

### SEP 2023–JAN 2024 | Axion detection experiments

*Junior paper, Princeton University. With James Olsen.*

I reviewed axion-detection methods for an undergraduate audience, emphasizing experimental sensitivity and signal amplification.

### MAY–JUL 2023 | Heading-error corrections in SERF magnetometers

*Summer internship, Princeton University. With Michael Romalis.*

I isolated heading errors proportional to the generated magnetic field in spin-exchange relaxation-free magnetometers, and designed and built proof-of-concept Helmholtz coils to test corrections.
