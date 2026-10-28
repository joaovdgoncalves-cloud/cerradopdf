package stirling.software.proprietary.mcp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;

import stirling.software.proprietary.mcp.catalog.McpToolCatalog;
import stirling.software.proprietary.mcp.engine.EngineCapabilityClient;
import stirling.software.proprietary.mcp.security.McpSecurityConfig;
import stirling.software.proprietary.mcp.tools.CerradoPDFAiTool;
import stirling.software.proprietary.mcp.tools.CerradoPDFConvertTool;
import stirling.software.proprietary.mcp.tools.CerradoPDFDownloadTool;
import stirling.software.proprietary.mcp.tools.CerradoPDFMiscTool;
import stirling.software.proprietary.mcp.tools.CerradoPDFPagesTool;
import stirling.software.proprietary.mcp.tools.CerradoPDFSecurityTool;
import stirling.software.proprietary.mcp.tools.CerradoPDFUploadTool;
import stirling.software.proprietary.mcp.tools.DescribeOperationTool;
import stirling.software.proprietary.mcp.tools.McpOperationExecutor;

/** Verifies MCP beans are gated behind {@code @ConditionalOnProperty(name="mcp.enabled")}. */
class McpConditionalTest {

    @Test
    void serverController_isGatedByMcpEnabled() {
        assertGatedByEnabled(McpServerController.class);
    }

    @Test
    void securityConfig_isGatedByMcpEnabled() {
        assertGatedByEnabled(McpSecurityConfig.class);
    }

    @Test
    void categoryToolsAndDescribeOperation_doNotNeedOwnGate() {
        // The tool beans are only wired into the gated controller; sanity-check their signatures.
        Class<?>[] tools = {
            DescribeOperationTool.class,
            CerradoPDFConvertTool.class,
            CerradoPDFPagesTool.class,
            CerradoPDFMiscTool.class,
            CerradoPDFSecurityTool.class,
            CerradoPDFAiTool.class
        };
        for (Class<?> t : tools) {
            assertTrue(
                    McpTool.class.isAssignableFrom(t),
                    t.getSimpleName() + " must implement McpTool");
            assertNotNull(
                    t.getAnnotation(org.springframework.stereotype.Component.class),
                    t.getSimpleName() + " must be @Component");
        }
    }

    @Test
    void mcpBeans_areNotSaasProfileRestricted() {
        // Beans gate on mcp.enabled only; no @Profile, so MCP can run under the saas profile too.
        Class<?>[] beans = {
            McpServerController.class,
            McpSecurityConfig.class,
            McpToolCatalog.class,
            EngineCapabilityClient.class,
            McpOperationExecutor.class,
            DescribeOperationTool.class,
            CerradoPDFAiTool.class,
            CerradoPDFConvertTool.class,
            CerradoPDFMiscTool.class,
            CerradoPDFPagesTool.class,
            CerradoPDFSecurityTool.class,
            CerradoPDFUploadTool.class,
            CerradoPDFDownloadTool.class
        };
        for (Class<?> bean : beans) {
            assertNull(
                    bean.getAnnotation(Profile.class),
                    bean.getSimpleName()
                            + " must not be @Profile-restricted so MCP can run under saas");
        }
    }

    private static void assertGatedByEnabled(Class<?> beanClass) {
        ConditionalOnProperty conditional = beanClass.getAnnotation(ConditionalOnProperty.class);
        assertNotNull(conditional, beanClass.getSimpleName() + " missing @ConditionalOnProperty");
        assertTrue(
                Arrays.asList(conditional.name()).contains("mcp.enabled")
                        || Arrays.asList(conditional.value()).contains("mcp.enabled"),
                beanClass.getSimpleName() + " must gate on mcp.enabled");
        assertEquals(
                "true",
                conditional.havingValue(),
                beanClass.getSimpleName() + " must require mcp.enabled=true");
    }
}
