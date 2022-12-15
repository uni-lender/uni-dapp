import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
body {
    margin: 0;
    padding: 0;
    background-color: var(--bg);
}
#root {
    display: flex;
    flex-direction: column;
    > div {
        flex: 1;
        padding: 40px 100px;
    }
}

body .MuiTableContainer-root {
    background-color: transparent;
    box-shadow: none;
    border: 1px solid var(--border-color);
    .MuiTableRow-head {
        font-size: 18px;
    }
    .MuiTableHead-root .MuiTableCell-root {
        color: var(--header-color);
        font-size: 18px;
    }
    .MuiTableBody-root .MuiTableCell-root {
        background-color: var(--bg);
        color: var(--text-color);
        border-color: var(--border-color);
    }
    .MuiTableRow-root .MuiTableCell-root {
        border-color: var(--border-color);
    }
}
.MuiDialog-paperScrollPaper {
    background: #ffffff;
    padding: 20px;
    text-align: center;
}
.MuiTypography-h6 {
    color: var(--header-color);
}
body .MuiButton-outlinedPrimary {
    border-color: var(--primary-color);
    color: var(--primary-color);
    &:hover {
        border-color: var(--primary-color);
        opacity: 0.8;
    }
}
body .MuiButton-textPrimary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: #ffffff;
    &:hover {
      opacity: 0.8;
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    &.Mui-disabled {
        opacity: 0.6;
        color: var(--text-color);
    }
 }
:root {
    --bg: #191b1f;
    --primary-color: #ff007a;
    --text-color: #ffffff;
    --header-color: #999;
    --border-color: rgba(255, 255, 255, 0.13)
}`;
