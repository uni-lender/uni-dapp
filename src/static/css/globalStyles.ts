import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
body {
    margin: 0;
    padding: 0;
}
#root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    > div {
        flex: 1;
        padding: 40px;
    }
}`