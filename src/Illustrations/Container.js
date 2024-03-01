import React from 'react'
import { motion } from 'framer-motion'

export default function Container({ liquid, bubbles }) {
	return (
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 512 512">
			<motion.path fill={liquid} stroke="none" d="
M53.602791,100.840446 
	C65.617073,108.947006 78.613464,112.212303 92.438942,110.836861 
	C104.672699,109.619766 116.295105,105.418205 127.957520,101.551292 
	C140.358582,97.439484 152.596298,92.820587 165.382828,89.847122 
	C183.825684,85.558296 201.160263,87.218475 217.828140,96.844254 
	C227.850449,102.632172 237.887192,108.712852 249.780197,110.444763 
	C256.586334,111.435905 263.426544,111.442574 270.121918,110.789215 
	C291.195740,108.732758 309.886047,98.824722 329.500549,91.942276 
	C348.241516,85.366333 365.980011,85.703575 382.506042,98.740097 
	C390.179840,104.793533 399.848022,107.227852 409.456757,108.984268 
	C426.965240,112.184692 443.448639,108.832260 459.563354,100.913574 
	C462.632843,101.083336 462.857178,103.152580 463.056946,105.175835 
	C463.269928,107.332680 463.218140,109.503166 463.218231,111.668800 
	C463.222198,212.795029 463.202972,313.921265 463.257782,415.047455 
	C463.262482,423.711823 461.957611,431.969208 457.652344,439.567841 
	C449.617065,453.749847 436.962250,460.178314 421.104065,461.128265 
	C419.108734,461.247803 417.106934,461.216675 415.107727,461.216827 
	C309.649902,461.224304 204.192062,461.218750 98.734238,461.226379 
	C87.536263,461.227173 76.868317,459.630219 67.626236,452.519073 
	C57.537296,444.756256 52.013493,434.591125 50.876072,421.981171 
	C50.711670,420.158508 50.784340,418.318054 50.784153,416.485443 
	C50.773735,314.692810 50.762695,212.900162 50.843689,111.107597 
	C50.846455,107.632248 49.555336,103.653099 53.602791,100.840446 
z" />
			<path fill="#000" stroke="none" d="
M54.075577,100.346825 
	C52.257431,101.967979 53.040154,103.820312 53.039566,105.352524 
	C52.999458,209.979706 52.976612,314.606903 53.026993,419.234100 
	C53.037628,441.318695 70.464233,458.262238 93.501732,458.670959 
	C104.993813,458.874878 116.492424,458.712494 127.988083,458.712524 
	C224.784897,458.712891 321.581726,458.721252 418.378540,458.705048 
	C437.872894,458.701782 452.519104,449.040314 458.423248,432.389374 
	C460.046356,427.811829 460.916931,423.083069 460.917389,418.222992 
	C460.927155,313.762390 460.927155,209.301804 460.914398,104.841209 
	C460.914246,103.686722 460.721252,102.532249 460.273956,101.106842 
	C459.953491,78.671638 460.067688,56.506760 459.918701,34.343647 
	C459.891571,30.311790 460.867279,28.676331 465.166473,28.914391 
	C471.313751,29.254784 477.497589,29.129940 483.658386,28.950064 
	C486.820923,28.857727 488.414276,29.800104 488.014740,33.165279 
	C487.897705,34.151146 487.999908,35.162926 487.999908,36.162830 
	C488.000000,163.984161 488.002411,291.805511 487.998199,419.626831 
	C487.997131,451.838043 463.334412,480.293182 431.405792,484.884552 
	C429.606689,485.143280 427.745697,484.996368 425.913513,484.996429 
	C313.590729,485.000397 201.267899,485.042023 88.945168,484.961426 
	C68.577477,484.946808 52.663818,475.393799 40.153255,460.054840 
	C29.927439,447.517090 25.948378,432.704773 25.957968,416.570129 
	C26.033342,289.748749 25.999554,162.927307 26.000364,36.105881 
	C26.000410,29.006372 26.004408,29.004782 32.896755,29.000776 
	C37.729637,28.997969 42.562519,28.996723 47.395397,29.001097 
	C53.987858,29.007063 53.992519,29.009636 53.999241,35.398335 
	C54.021858,56.895863 54.040848,78.393387 54.075577,100.346825 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M158.771790,390.894226 
	C153.463516,394.041138 148.662842,393.890656 145.206680,390.557037 
	C141.693329,387.168304 140.973495,383.103943 143.087555,378.728790 
	C145.214218,374.327606 148.952789,372.517303 153.725983,373.067932 
	C157.510254,373.504486 160.282822,375.710358 161.536987,379.216736 
	C163.027420,383.383728 162.601074,387.415497 158.771790,390.894226 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M201.994537,277.770630 
	C206.450836,275.091583 210.597168,275.047302 214.321365,278.158600 
	C217.309189,280.654724 218.658264,284.095245 217.643158,287.985321 
	C216.599899,291.983063 213.957611,294.667450 209.823990,295.475342 
	C205.196274,296.379822 201.713837,294.369629 199.304199,290.548248 
	C196.833267,286.629730 197.727722,282.410828 201.994537,277.770630 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M102.343811,271.254852 
	C108.269020,267.993073 112.584297,268.419891 116.108948,272.339752 
	C119.299522,275.888062 119.578674,280.880219 116.799095,284.681152 
	C113.375504,289.362701 107.300606,290.281342 102.756584,286.804657 
	C98.010941,283.173706 97.718948,276.886444 102.343811,271.254852 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M238.522003,197.889862 
	C231.176941,194.533768 228.884552,188.434982 232.595169,183.096283 
	C235.242340,179.287659 240.317764,177.841171 244.491028,179.705978 
	C248.710037,181.591232 250.953384,186.218948 249.883652,190.830200 
	C248.794678,195.524521 245.023056,197.977036 238.522003,197.889862 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M368.962555,158.848206 
	C373.108826,156.206085 376.913788,156.244202 380.320282,159.255829 
	C382.905029,161.540970 383.670593,164.596313 382.474915,167.912292 
	C381.234222,171.353073 378.675323,173.440903 375.069153,173.785095 
	C371.644073,174.111954 368.816467,172.587433 367.130859,169.591156 
	C365.000824,165.804749 365.635834,162.229813 368.962555,158.848206 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M268.433441,390.471741 
	C262.853241,388.035889 261.019470,385.147217 261.978027,380.461334 
	C262.782318,376.529877 265.464020,374.347260 269.309784,374.189484 
	C273.422943,374.020721 276.209229,376.404388 277.520508,380.223480 
	C279.306854,385.426361 275.610168,389.718964 268.433441,390.471741 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M349.224854,279.343262 
	C344.989014,281.917694 341.238007,281.781860 338.256256,278.168579 
	C335.814789,275.209961 335.416138,271.780579 337.992493,268.609802 
	C340.572662,265.434357 343.936829,264.465485 347.750519,266.180847 
	C352.683014,268.399475 353.400848,273.944458 349.224854,279.343262 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M406.101349,323.748291 
	C409.354797,322.368927 412.037872,322.598328 414.003693,325.282349 
	C415.534271,327.372192 415.407745,329.654083 414.053589,331.836151 
	C412.597931,334.181915 410.299683,334.504425 407.901672,334.039978 
	C403.283234,333.145416 402.348083,328.542480 406.101349,323.748291 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M175.661560,193.226837 
	C173.276794,190.354309 173.345840,187.809174 175.817688,185.522781 
	C177.578201,183.894363 179.619476,183.667175 181.740097,184.925201 
	C184.127441,186.341446 184.703293,188.681549 183.840012,190.941559 
	C182.381134,194.760788 179.580368,195.742966 175.661560,193.226837 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M114.679443,189.673248 
	C117.335587,188.528885 119.446602,188.668335 119.750961,191.660202 
	C119.939919,193.517654 118.492767,194.976730 116.632263,194.757065 
	C113.705727,194.411514 113.454254,192.346832 114.679443,189.673248 
z" />
			<motion.path fill={bubbles} stroke="none" d="
M335.214600,157.256958 
	C333.576416,155.578217 333.497650,154.120285 335.476868,153.225739 
	C336.609589,152.713760 337.911499,153.242828 338.198395,154.505219 
	C338.659729,156.535049 337.564117,157.510910 335.214600,157.256958 
z" />
		</svg>
	)
}