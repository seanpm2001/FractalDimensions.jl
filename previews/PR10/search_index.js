var documenterSearchIndex = {"docs":
[{"location":"#FractalDimensions.jl","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"FractalDimensions","category":"page"},{"location":"#FractalDimensions","page":"FractalDimensions.jl","title":"FractalDimensions","text":"FractalDimensions.jl\n\n(Image: ) (Image: ) (Image: ) (Image: CI) (Image: codecov) (Image: Package Downloads) (Image: Package Downloads)\n\nA Julia package that estimates various definitions of fractal dimension from data. It can be used as a standalone package, or as part of DynamicalSystems.jl.\n\nTo install it, run import Pkg; Pkg.add(\"FractalDimensions\").\n\nAll further information is provided in the documentation, which you can either find online or build locally by running the docs/make.jl file.\n\nPreviously, this package was part of ChaosTools.jl.\n\nCitation\n\nIf you use this package in a publication, please cite the paper below:\n\n@ARTICLE{FractalDimensions.jl,\n  title     = \"Estimating the fractal dimension: a comparative review and open\n               source implementations\",\n  author    = \"Datseris, George and Kottlarz, Inga and Braun, Anton P and\n               Parlitz, Ulrich\",\n  publisher = \"arXiv\",\n  year      =  2021,\n  doi = {10.48550/ARXIV.2109.05937},\n  url = {https://arxiv.org/abs/2109.05937},\n}\n\n\n\n\n\n","category":"module"},{"location":"#Introduction","page":"FractalDimensions.jl","title":"Introduction","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"note: Note\nThis package is accompanying a review paper on the fractal dimension: https://arxiv.org/abs/2109.05937. The paper is continuing the discussion of chapter 5 of Nonlinear Dynamics, Datseris & Parlitz, Springer 2022.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"There are numerous methods that one can use to calculate a so-called \"dimension\" of a dataset which in the context of dynamical systems is called the Fractal dimension. In the majority of cases, computing a fractal dimension means estimating the scaling behaviour of some quantity as a size/scale increases. In the Fractal dimension example below, one finds the scaling of the entropy of the histogram of some data, versus the width of the bins of the histogram. In this case, it approximately holds $ H \\approx -\\Delta\\log(\\varepsilon) $ for bin width varepsilon. The scaling of many other quantities can be estimated as well, such as the correlation sum, the Higuchi length, or others provided here.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"To actually find Delta, one needs to find a linearly scaling region in the graph H vs. log(varepsilon) and estimate its slope. Hence, identifying a linear region is central to estimating a fractal dimension. That is why, the section Linear scaling regions is of central importance for this documentation.","category":"page"},{"location":"#Fractal-dimension-example","page":"FractalDimensions.jl","title":"Fractal dimension example","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"In this simplest example we will calculate the fractal dimension of the chaotic attractor of the Hénon map (for default parameters).","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"using DynamicalSystemsBase: DeterministicIteratedMap, trajectory\nusing CairoMakie\n\nhenon_rule(x, p, n) = SVector(1.0 - p[1]*x[1]^2 + x[2], p[2]*x[1])\nu0 = zeros(2)\np0 = [1.4, 0.3]\nhenon = DeterministicIteratedMap(henon_rule, u0, p0)\n\nX, t = trajectory(henon, 100_000; Ttr = 100)\nscatter(X[:, 1], X[:, 2]; color = (\"black\", 0.01), markersize = 4)","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"Our goal is to compute entropies of the histogram of the above plot for many different partition sizes (bin widths) ε. Computing entropies is the job of ComplexityMeasures.jl, but the two relevant names (entropy, ValueHistogram) are re-exported by FractalDimensions.jl.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"using FractalDimensions\nες = 2 .^ (-15:0.5:5) # semi-random guess\nHs = [entropy(ValueHistogram(ε), X) for ε in ες]","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"xs = @. -log2(ες) # must use same base as `entropy`!!!\nscatterlines(xs, Hs; axis = (ylabel = L\"H_1\", xlabel = L\"-\\log (\\epsilon)\"))","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"The slope of the linear scaling region of the above plot is the generalized dimension (of order q = 1) for the attractor of the Hénon map.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"Given that we see the plot, we can estimate where the linear scaling region starts and ends. However, we can use the function linear_region to get an estimate of the result as well. First let's visualize what it does, as it uses linear_regions.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"lrs, slopes = linear_regions(xs, Hs, tol = 0.25)\nfig = Figure()\nax = Axis(fig[1,1]; ylabel = L\"H_1\", xlabel = L\"-\\log (\\epsilon)\")\nfor r in lrs\n    scatterlines!(ax, xs[r], Hs[r])\nend\nfig","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"The linear_region function finds, and computes the slope of, the largest region:","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"Δ = linear_region(xs, Hs)[2]","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"This result is an approximation of the information dimension (because we used q = 1) of the attractor.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"The whole above pipeline we went through is bundled in generalized_dim. Similar pipeline is done by grassberger_proccacia_dim and many other functions.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"danger: Be wary when using `xxxxx_dim`\nAs stated clearly by the documentation strings, all pre-made dimension estimating functions (ending in _dim) perform a lot of automated steps, each having its own heuristic choices for function default values. They are more like convenient bundles with on-average good defaults, rather than precise functions. You should be careful when considering the validity of the returned number!","category":"page"},{"location":"#Linear-scaling-regions","page":"FractalDimensions.jl","title":"Linear scaling regions","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"And other utilities, especially linreg, used in both [generalized_dim] and grassberger_dim.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"linear_regions\nlinear_region\nlinreg\nestimate_boxsizes","category":"page"},{"location":"#FractalDimensions.linear_regions","page":"FractalDimensions.jl","title":"FractalDimensions.linear_regions","text":"linear_regions(x, y; dxi::Int = 1, tol = 0.25) -> (lrs, tangents)\n\nIdentify regions where the curve y(x) is linear, by scanning the x-axis every dxi indices sequentially (e.g. at x[1] to x[5], x[5] to x[10], x[10] to x[15] and so on if dxi=5).\n\nIf the slope (calculated via linear regression) of a region of width dxi is approximatelly equal to that of the previous region, within tolerance tol, then these two regions belong to the same linear region.\n\nReturn the indices of x that correspond to the linear regions, lrs, and the correct tangents at each region (obtained via a second linear regression at each accumulated region). lrs is hence a vector of UnitRanges.\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.linear_region","page":"FractalDimensions.jl","title":"FractalDimensions.linear_region","text":"linear_region(x, y; kwargs...) -> (region, slope)\n\nCall linear_regions and identify and return the largest linear region (a UnitRange of the indices of x) and its corresponding slope.\n\nThe keywords dxi, tol are propagated as-is to linear_regions. The keyword ignore_saturation = true ignores saturation that (sometimes) happens at the start and end of the curve y(x), where the curve flattens. The keyword sat = 0.01 decides what saturation is (while abs(y[i]-y[i+1])<sat we are in a saturation regime).\n\nThe keyword warning = true prints a warning if the linear region is less than 1/3 of the available x-axis.\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.linreg","page":"FractalDimensions.jl","title":"FractalDimensions.linreg","text":"linreg(x, y) -> a, b\n\nPerform a linear regression to find the best coefficients so that the curve: z = a + b*x has the least squared error with y.\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.estimate_boxsizes","page":"FractalDimensions.jl","title":"FractalDimensions.estimate_boxsizes","text":"estimate_boxsizes(X::AbstractStateSpaceSet; kwargs...) → εs\n\nReturn k exponentially spaced values: εs = base .^ range(lower + w, upper + z; length = k), that are a good estimate for sizes ε that are used in calculating a Fractal Dimension. It is strongly recommended to standardize input dataset before using this function.\n\nLet d₋ be the minimum pair-wise distance in A and d₊ the average total length of A along each of the dimensions of A. Then lower = log(base, d₋) and upper = log(base, d₊). Because by default w=1, z=-1, the returned sizes are an order of mangitude larger than the minimum distance, and an order of magnitude smaller than the maximum distance.\n\nKeywords\n\nw = 1, z = -1, k = 20 : as explained above.\nbase = MathConstants.e : the base used in the log function.\nwarning = true: Print some warnings for bad estimates.\nautoexpand = true: If the final estimated range does not cover at least 2 orders of magnitude, it is automatically expanded by setting w -= we and z -= ze. You can set different default values to the keywords we = w, ze = z.\n\n\n\n\n\n","category":"function"},{"location":"#Generalized-(entropy)-dimension","page":"FractalDimensions.jl","title":"Generalized (entropy) dimension","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"Based on the definition of the Generalized entropy (genentropy), one can calculate an appropriate dimension, called generalized dimension:","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"generalized_dim\nmolteno_dim\nmolteno_boxing","category":"page"},{"location":"#FractalDimensions.generalized_dim","page":"FractalDimensions.jl","title":"FractalDimensions.generalized_dim","text":"generalized_dim(X::AbstractStateSpaceSet [, sizes]; q = 1, base = 2) -> Δ_q\n\nReturn the q order generalized dimension of the dataset X, by calculating  its histogram-based Rényi entropy for each ε ∈ sizes.\n\nThe case of q = 0 is often called \"capacity\" or \"box-counting\" dimension, while q = 1 is the \"information\" dimension.\n\nDescription\n\nThe returned dimension is approximated by the (inverse) power law exponent of the scaling of the Renyi entropy H_q, versus the box size ε, where ε ∈ sizes:\n\nH_q approx -Delta_qlog_b(varepsilon)\n\nH_q is calculated using entropy, Renyi(; base, q) and the ValueHistogram probabilities estimator, i.e., by doing a histogram of the data with a given box size.\n\nCalling this function performs a lot of automated steps:\n\nA vector of box sizes is decided by calling sizes = estimate_boxsizes(dataset), if sizes is not given.\nFor each element of sizes the appropriate entropy is calculated as\nH = [entropy(Renyi(; q, base), ValueHistogram(ε), data) for ε ∈ sizes]\nLet x = -log.(sizes).\nThe curve H(x) is decomposed into linear regions, using linear_regions(x, h).\nThe biggest linear region is chosen, and a fit for the slope of that region is performed using the function linear_region, which does a simple linear regression fit using linreg. This slope is the return value of generalized_dim.\n\nBy doing these steps one by one yourself, you can adjust the keyword arguments given to each of these function calls, refining the accuracy of the result. The source code of this function is only 3 lines of code.\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.molteno_dim","page":"FractalDimensions.jl","title":"FractalDimensions.molteno_dim","text":"molteno_dim(X::AbstractStateSpaceSet; k0::Int = 10, q = 1.0, base = 2)\n\nReturn an estimate of the generalized_dim of X using the algorithm by [Molteno1993]. This function is a simple utilization of the probabilities estimated by molteno_boxing so see that function for more details. Here the entropy of the probabilities is computed at each size, and a line is fitted in the entropy vs log(size) graph, just like in generalized_dim.\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.molteno_boxing","page":"FractalDimensions.jl","title":"FractalDimensions.molteno_boxing","text":"molteno_boxing(X::AbstractStateSpaceSet; k0::Int = 10) → (probs, εs)\n\nDistribute X into boxes whose size is halved in each step, according to the algorithm by [Molteno1993]. Division stops if the average number of points per filled box falls below the threshold k0.\n\nReturn probs, a vector of Probabilities of finding points in boxes for different box sizes, and the corresponding box sizes εs. These outputs are used in molteno_dim.\n\nDescription\n\nProject the data onto the whole interval of numbers that is covered by UInt64. The projected data is distributed into boxes whose size decreases by factor 2 in each step. For each box that contains more than one point 2^D new boxes are created where D is the dimension of the data.\n\nThe process of dividing the data into new boxes stops when the number of points over the number of filled boxes falls below k0. The box sizes εs are calculated and returned together with the probs.\n\nThis algorithm is faster than the traditional approach of using ValueHistogram(ε::Real), but it is only suited for low dimensional data since it divides each box into 2^D new boxes if D is the dimension. For large D this leads to low numbers of box divisions before the threshold is passed and the divison stops. This results to a low number of data points to fit the dimension to and thereby a poor estimate.\n\n[Molteno1993]: Molteno, T. C. A., Fast O(N) box-counting algorithm for estimating dimensions. Phys. Rev. E 48, R3263(R) (1993)\n\n\n\n\n\n","category":"function"},{"location":"#Correlation-sum-based-dimension","page":"FractalDimensions.jl","title":"Correlation sum based dimension","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"grassberger_proccacia_dim\ncorrelationsum","category":"page"},{"location":"#FractalDimensions.grassberger_proccacia_dim","page":"FractalDimensions.jl","title":"FractalDimensions.grassberger_proccacia_dim","text":"grassberger_proccacia_dim(X::AbstractStateSpaceSet, εs = estimate_boxsizes(data); kwargs...)\n\nUse the method of Grassberger and Proccacia[Grassberger1983], and the correction by Theiler[Theiler1986], to estimate the correlation dimension Δ_C of  X.\n\nThis function does something extremely simple:\n\ncm = correlationsum(data, εs; kwargs...)\nΔ_C = linear_region(log2.(sizes), log2.(cm))[2]\n\ni.e. it calculates correlationsum for various radii and then tries to find a linear region in the plot of the log of the correlation sum versus log(ε).\n\nSee correlationsum for the available keywords. See also takens_best_estimate, boxassisted_correlation_dim.\n\n[Grassberger1983]: Grassberger and Proccacia, Characterization of strange attractors, PRL 50 (1983) \n\n[Theiler1986]: Theiler, Spurious dimension from correlation algorithms applied to limited time-series data. Physical Review A, 34\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.correlationsum","page":"FractalDimensions.jl","title":"FractalDimensions.correlationsum","text":"correlationsum(X, ε::Real; w = 0, norm = Euclidean(), q = 2) → C_q(ε)\n\nCalculate the q-order correlation sum of X (StateSpaceSet or timeseries) for a given radius ε and norm. They keyword show_progress = true can be used to display a progress bar for large X.\n\ncorrelationsum(X, εs::AbstractVector; w, norm, q) → C_q(ε)\n\nIf εs is a vector, C_q is calculated for each ε ∈ εs more efficiently. If also q=2, we attempt to do further optimizations, if the allocation of a matrix of size N×N is possible.\n\nThe function boxed_correlationsum is faster and should be preferred over this one.\n\nDescription\n\nThe correlation sum is defined as follows for q=2:\n\nC_2(epsilon) = frac2(N-w)(N-w-1)sum_i=1^Nsum_j=1+w+i^N\nB(X_i - X_j  epsilon)\n\nfor as follows for q≠2\n\nC_q(epsilon) = leftfrac1alpha sum_i=w+1^N-w\nleftsum_ji-j  w B(X_i - X_j  epsilon)right^q-1right^1(q-1)\n\nwhere\n\nalpha = (N-2w)(N-2w-1)^(q-1)\n\nwith N the length of X and B gives 1 if its argument is true. w is the Theiler window.\n\nSee the article of Grassberger for the general definition [Grassberger2007] and the book \"Nonlinear Time Series Analysis\" [Kantz2003], Ch. 6, for a discussion around choosing best values for w, and Ch. 11.3 for the explicit definition of the q-order correlationsum.\n\n[Grassberger2007]: Peter Grassberger (2007) Grassberger-Procaccia algorithm. Scholarpedia, 2(5):3043.\n\n[Kantz2003]: Kantz, H., & Schreiber, T. (2003). Nonlinear Time Series Analysis, Cambridge University Press.\n\n\n\n\n\n","category":"function"},{"location":"#Box-assisted-version","page":"FractalDimensions.jl","title":"Box-assisted version","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"boxassisted_correlation_dim\nboxed_correlationsum\nestimate_r0_buenoorovio\nestimate_r0_theiler","category":"page"},{"location":"#FractalDimensions.boxassisted_correlation_dim","page":"FractalDimensions.jl","title":"FractalDimensions.boxassisted_correlation_dim","text":"boxassisted_correlation_dim(X::AbstractStateSpaceSet; kwargs...)\n\nUse the box-assisted optimizations of [Bueno2007] to estimate the correlation dimension Δ_C of X.\n\nThis function does something extremely simple:\n\nεs, Cs = boxed_correlationsum(X; kwargs...)\nreturn linear_region(log2.(Cs), log2.(εs))[2]\n\nand hence see boxed_correlationsum for more information and available keywords.\n\n[Bueno2007]: Bueno-Orovio and Pérez-García, Enhanced box and prism assisted algorithms for computing the correlation dimension. Chaos Solitons & Fractrals, 34(5) \n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.boxed_correlationsum","page":"FractalDimensions.jl","title":"FractalDimensions.boxed_correlationsum","text":"boxed_correlationsum(X::AbstractStateSpaceSet, εs, r0 = maximum(εs); kwargs...) → Cs\n\nEstimate the box assisted q-order correlation sum Cs out of a dataset X for each radius in εs, by splitting the data into boxes of size r0 beforehand. This method is much faster than correlationsum, provided that the box size r0 is significantly smaller than then the attractor length. Good choices for r0 are estimate_r0_buenoorovio and estimate_r0_theiler.\n\nSee correlationsum for the definition of the correlation sum.\n\nboxed_correlationsum(X::AbstractStateSpaceSet; kwargs...) → εs, Cs\n\nIn this method the minimum inter-point distance and estimate_r0_buenoorovio of X are used to estimate good εs for the calculation, which are also returned.\n\nKeyword arguments\n\nq = 2 : The order of the correlation sum.\nP = autoprismdim(X) : The prism dimension.\nw = 0 : The Theiler window.\nshow_progress = false : Whether to display a progress bar for the calculation.\n\nDescription\n\nC_q(ε) is calculated for every ε ∈ εs and each of the boxes to then be summed up afterwards. The method of splitting the data into boxes was implemented according to Theiler[Theiler1987]. w is the Theiler window. P is the prism dimension. If P is unequal to the dimension of the data, only the first P dimensions are considered for the box distribution (this is called the prism-assisted version). By default P is choosen automatically.\n\nThe function is explicitly optimized for q = 2 but becomes quite slow for q ≠ 2.\n\nSee correlationsum for the definition of C_q.\n\n[Theiler1987]: Theiler, Efficient algorithm for estimating the correlation dimension from a set of discrete points. Physical Review A, 36\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.estimate_r0_buenoorovio","page":"FractalDimensions.jl","title":"FractalDimensions.estimate_r0_buenoorovio","text":"estimate_r0_buenoorovio(X::AbstractStateSpaceSet, P = autoprismdim(X)) → r0, ε0\n\nEstimate a reasonable size for boxing X, proposed by Bueno-Orovio and Pérez-García[Bueno2007], before calculating the correlation dimension as presented by Theiler[Theiler1983]. Return the size r0 and the minimum interpoint distance ε0 in the data.\n\nIf instead of boxes, prisms are chosen everything stays the same but P is the dimension of the prism. To do so the dimension ν is estimated by running the algorithm by Grassberger and Procaccia[Grassberger1983] with √N points where N is the number of total data points. An effective size ℓ of the attractor is calculated by boxing a small subset of size N/10 into boxes of sidelength r_ℓ and counting the number of filled boxes η_ℓ.\n\nell = r_ell eta_ell ^1nu\n\nThe optimal number of filled boxes η_opt is calculated by minimising the number of calculations.\n\neta_textrmopt = N^23cdot frac3^nu - 13^P - 1^12\n\nP is the dimension of the data or the number of edges on the prism that don't span the whole dataset.\n\nThen the optimal boxsize r_0 computes as\n\nr_0 = ell  eta_textrmopt^1nu\n\n[Bueno2007]: Bueno-Orovio and Pérez-García, Enhanced box and prism assisted algorithms for computing the correlation dimension. Chaos Solitons & Fractrals, 34(5) \n\n[Theiler1987]: Theiler, Efficient algorithm for estimating the correlation dimension from a set of discrete points. Physical Review A, 36\n\n[Grassberger1983]: Grassberger and Proccacia, Characterization of strange attractors, PRL 50 (1983) \n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.estimate_r0_theiler","page":"FractalDimensions.jl","title":"FractalDimensions.estimate_r0_theiler","text":"estimate_r0_theiler(X::AbstractStateSpaceSet) → r0, ε0\n\nEstimate a reasonable size for boxing the data X before calculating the boxed_correlationsum proposed by Theiler[Theiler1987]. Return the boxing size r0 and minimum inter-point distance in X, ε0.\n\nTo do so the dimension is estimated by running the algorithm by Grassberger and Procaccia[Grassberger1983] with √N points where N is the number of total data points. Then the optimal boxsize r_0 computes as\n\nr_0 = R (2N)^1nu\n\nwhere R is the size of the chaotic attractor and nu is the estimated dimension.\n\n[Theiler1987]: Theiler, Efficient algorithm for estimating the correlation dimension from a set of discrete points. Physical Review A, 36\n\n[Grassberger1983]: Grassberger and Proccacia, Characterization of strange attractors, PRL 50 (1983) \n\n\n\n\n\n","category":"function"},{"location":"#Fixed-mass-correlation-sum","page":"FractalDimensions.jl","title":"Fixed mass correlation sum","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"fixedmass_correlation_dim\nfixedmass_correlationsum","category":"page"},{"location":"#FractalDimensions.fixedmass_correlation_dim","page":"FractalDimensions.jl","title":"FractalDimensions.fixedmass_correlation_dim","text":"fixedmass_correlation_dim(X [, max_j]; kwargs...)\n\nUse the fixed mass algorithm for computing the correlation sum, and use the result to compute the correlation dimension Δ_M of X.\n\nThis function does something extremely simple:\n\nrs, ys = fixedmass_correlationsum(X, max_j; kwargs...)\nlinear_region(rs, ys)[2]\n\n\n\n\n\n","category":"function"},{"location":"#FractalDimensions.fixedmass_correlationsum","page":"FractalDimensions.jl","title":"FractalDimensions.fixedmass_correlationsum","text":"fixedmass_correlationsum(X [, max_j]; metric = Euclidean(), M = length(X)) → rs, ys\n\nA fixed mass algorithm for the calculation of the correlationsum, and subsequently a fractal dimension Delta, with max_j the maximum number of neighbours that should be considered for the calculation.\n\nBy default max_j = clamp(N*(N-1)/2, 3, 64) with N the data length.\n\nKeyword arguments\n\nM defines the number of points considered for the averaging of distances, randomly subsampling them from X.\nmetric = Euclidean() is the distance metric.\nstart_j = 4 computes the equation below starting from j = 1 + skip_j. Typically the first j values have not converged to the correct scaling of the fractal dimension.\n\nDescription\n\n\"Fixed mass\" algorithms mean that instead of trying to find all neighboring points within a radius, one instead tries to find the max radius containing j points. A correlation sum is obtained with this constrain, and equivalently the mean radius containing k points. Based on this, one can calculate Delta approximating the information dimension. The implementation here is due to to [Grassberger1988], which defines\n\nΨ(j) - log N sim Delta times overlinelog left( r_(j)right)\n\nwhere Psi(j) = fractextd log Γ(j)textd j is the digamma function, rs = overlinelog left( r_(j)right) is the mean logarithm of a radius containing j neighboring points, and ys = Psi(j) - log N (N is the length of the data). The amount of neighbors found j range from 2 to max_j. The numbers are also converted to base 2 from base e.\n\nDelta can be computed by using linear_region(rs, ys).\n\n[Grassberger1988]: Peter Grassberger (1988) Finite sample Corrections to Entropy and Dimension Estimates, Physics Letters A 128(6-7)\n\n\n\n\n\n","category":"function"},{"location":"#Takens-best-estimate","page":"FractalDimensions.jl","title":"Takens best estimate","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"takens_best_estimate_dim","category":"page"},{"location":"#FractalDimensions.takens_best_estimate_dim","page":"FractalDimensions.jl","title":"FractalDimensions.takens_best_estimate_dim","text":"takens_best_estimate_dim(X, εmax, metric = Chebyshev(), εmin = 0)\n\nUse the \"Takens' best estimate\" [Takens1985][Theiler1988] method for estimating the correlation dimension.\n\nThe original formula is\n\nDelta_C approx fracC(epsilon_textmax)int_0^epsilon_textmax(C(epsilon)  epsilon)  depsilon\n\nwhere C is the correlationsum and epsilon_textmax is an upper cutoff. Here we use the later expression\n\nDelta_C approx - frac1etaquad eta = frac1(N-1)^*sum_i j^*log(X_i - X_j  epsilon_textmax)\n\nwhere the sum happens for all i j so that i  j and X_i - X_j  epsilon_textmax. In the above expression, the bias in the original paper has already been corrected, as suggested in [Borovkova1999].\n\nAccording to [Borovkova1999], introducing a lower cutoff εmin can make the algorithm more stable (no divergence), this option is given but defaults to zero.\n\nIf X comes from a delay coordinates embedding of a timseries x, a recommended value for epsilon_textmax is std(x)/4.\n\nYou may also use\n\nΔ_C, Δu_C, Δl_C = FractalDimensions.takens_best_estimate(args...)\n\nto obtain the upper and lower 95% confidence intervals. The intervals are estimated from the log-likelihood function by finding the values of Δ_C where the function has fallen by 2 from its maximum, see e.g. [Barlow] chapter 5.3.\n\n[Takens1985]: Takens, On the numerical determination of the dimension of an attractor, in: B.H.W. Braaksma, B.L.J.F. Takens (Eds.), Dynamical Systems and Bifurcations, in: Lecture Notes in Mathematics, Springer, Berlin, 1985, pp. 99–106.\n\n[Theiler1988]: Theiler, Lacunarity in a best estimator of fractal dimension. Physics Letters A, 133(4–5)\n\n[Borovkova1999]: Borovkova et al., Consistency of the Takens estimator for the correlation dimension. The Annals of Applied Probability, 9, 05 1999.\n\n[Barlow]: Barlow, R., Statistics - A Guide to the Use of Statistical Methods in the Physical Sciences. Vol 29. John Wiley & Sons, 1993\n\n\n\n\n\n","category":"function"},{"location":"#Kaplan-Yorke-dimension","page":"FractalDimensions.jl","title":"Kaplan-Yorke dimension","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"kaplanyorke_dim","category":"page"},{"location":"#FractalDimensions.kaplanyorke_dim","page":"FractalDimensions.jl","title":"FractalDimensions.kaplanyorke_dim","text":"kaplanyorke_dim(λs::AbstractVector)\n\nCalculate the Kaplan-Yorke dimension, a.k.a. Lyapunov dimension[Kaplan1970] from the given Lyapunov exponents λs.\n\nDescription\n\nThe Kaplan-Yorke dimension is simply the point where cumsum(λs) becomes zero (interpolated):\n\n D_KY = k + fracsum_i=1^k lambda_ilambda_k+1quad k = max_j left sum_i=1^j lambda_i  0 right\n\nIf the sum of the exponents never becomes negative the function will return the length of the input vector.\n\nUseful in combination with lyapunovspectrum from ChaosTools.jl.\n\n[Kaplan1970]: J. Kaplan & J. Yorke, Chaotic behavior of multidimensional difference equations, Lecture Notes in Mathematics vol. 730, Springer (1979)\n\n\n\n\n\n","category":"function"},{"location":"#Higuchi-dimension","page":"FractalDimensions.jl","title":"Higuchi dimension","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"higuchi_dim","category":"page"},{"location":"#FractalDimensions.higuchi_dim","page":"FractalDimensions.jl","title":"FractalDimensions.higuchi_dim","text":"higuchi_dim(x::AbstractVector [, ks])\n\nEstimate the Higuchi dimension[Higuchi1988] of the graph of x.\n\nDescription\n\nThe Higuchi dimension is a number Δ ∈ [1, 2] that quantifies the roughness of the graph of the function x(t), assuming here that x is equi-sampled, like in the original paper.\n\nThe method estimates how the length of the graph increases as a function of the indices difference (which, in this context, is equivalent with differences in t). Specifically, we calculate the average length versus k as\n\nL_m(k) = fracN-1lfloor fracN-mk \rfloor k^2\nsum_i=1^lfloor fracN-mk rfloor X_N(m+ik)-X_N(m+(i-1)k) \n\nL(k) = frac1k sum_m=1^k L_m(k)\n\nand then use linear_region in -log2.(k) vs log2.(L) as per usual when computing a fractal dimension.\n\nThe algorithm chooses default ks to be exponentially spaced in base-2, up to at most 2^8. A user can provide their own ks as a second argument otherwise.\n\nUse FractalDimensions.higuchi_length(x, ks) to obtain L(k) directly.\n\n[Higuchi1988]: Higuchi, Approach to an irregular time series on the basis of the fractal theory, Physica D: Nonlinear Phenomena (1988)\n\n\n\n\n\n","category":"function"},{"location":"#Theiler-window","page":"FractalDimensions.jl","title":"Theiler window","text":"","category":"section"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"The Theiler window is a concept that is useful when finding neighbors in a dataset that is coming from the sampling of a continuous dynamical system. Itt tries to eliminate spurious \"correlations\" (wrongly counted neighbors) due to a potentially dense sampling of the trajectory. Typically a good choice for w coincides with the choice an optimal delay time, see DelayEmbeddings.estimate_delay, for any of the timeseries of the dataset.","category":"page"},{"location":"","page":"FractalDimensions.jl","title":"FractalDimensions.jl","text":"For more details, see Chapter 5 of Nonlinear Dynamics, Datseris & Parlitz, Springer 2022.","category":"page"}]
}
