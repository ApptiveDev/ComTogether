export default function ChatBotIcon({ text }: { text: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="86"
      height="85"
      viewBox="0 0 86 85"
      fill="none"
    >
      <g filter="url(#filter0_d_387_784)">
        <circle cx="43" cy="38" r="25" fill="#FF5525" />
        <text
          x="43"
          y="40"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="23.657px"
          fontWeight="700"
          lineHeight="150%"
          fill="#fff"
        >
          {text}
        </text>
      </g>
      <defs>
        <filter
          id="filter0_d_387_784"
          x="0.75782"
          y="0.355735"
          width="84.4844"
          height="84.4844"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4.59791" />
          <feGaussianBlur stdDeviation="8.62109" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_387_784"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_387_784"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
